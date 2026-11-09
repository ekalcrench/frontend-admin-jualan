import { useCallback, useEffect, useRef, useState } from "react";

import {
  getPrinterHealth,
  sendPrintRequest,
  ThermalPrinterError,
} from "@/services/printer/printer.service";

import type {
  PrinterHealth,
  PrintOptions,
  PrintResponse,
  ReceiptBlock,
} from "@/services/printer/printer.types";

type ConnectionStatus =
  | "checking"
  | "ready"
  | "bridge-unavailable"
  | "printer-disconnected";

interface UseThermalPrinterReturn {
  connectionStatus: ConnectionStatus;
  isChecking: boolean;
  isPrinting: boolean;
  refreshPrinter: () => Promise<PrinterHealth | null>;
  print: (
    content: ReceiptBlock[],
    options?: PrintOptions,
  ) => Promise<PrintResponse>;
}

export function useThermalPrinter(): UseThermalPrinterReturn {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("checking");

  const [isChecking, setIsChecking] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // Prevent multiple print requests simultaneously.
  const printingRef = useRef(false);

  const refreshPrinter = useCallback(async () => {
    setIsChecking(true);

    try {
      const health = await getPrinterHealth();

      setConnectionStatus(
        health.printer.connected ? "ready" : "printer-disconnected",
      );

      return health;
    } catch (err) {
      setConnectionStatus("bridge-unavailable");

      return null;
    } finally {
      setIsChecking(false);
    }
  }, []);

  const print = useCallback(
    async (
      content: ReceiptBlock[],
      options: PrintOptions = {},
    ): Promise<PrintResponse> => {
      if (printingRef.current) {
        throw new ThermalPrinterError(
          "Printing sedang berlangsung. Tunggu hingga selesai.",
          "print_in_progress",
        );
      }

      printingRef.current = true;
      setIsPrinting(true);

      try {
        // Always check printer connection before printing.
        const health = await getPrinterHealth();

        if (!health.printer.connected) {
          setConnectionStatus("printer-disconnected");

          throw new ThermalPrinterError(
            health.printer.problem
              ? `Printer tidak siap: ${health.printer.problem}`
              : "Printer Bluetooth tidak terhubung.",
            health.printer.problem ?? "printer_not_connected",
          );
        }

        setConnectionStatus("ready");

        const result = await sendPrintRequest(content, options);

        return result;
      } catch (err) {
        if (err instanceof ThermalPrinterError) {
          if (err.code === "bridge_unavailable") {
            setConnectionStatus("bridge-unavailable");
          } else if (err.statusCode === 503) {
            setConnectionStatus("printer-disconnected");
          }
        }

        const message =
          err instanceof Error ? err.message : "Gagal mencetak struk";

        throw err;
      } finally {
        printingRef.current = false;
        setIsPrinting(false);
      }
    },
    [],
  );

  // Check printer when component mounts.
  useEffect(() => {
    refreshPrinter();
  }, [refreshPrinter]);

  return {
    connectionStatus,
    isChecking,
    isPrinting,
    refreshPrinter,
    print,
  };
}
