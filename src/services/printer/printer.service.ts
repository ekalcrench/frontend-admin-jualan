import type {
  PrinterHealth,
  ReceiptBlock,
  PrintOptions,
  PrintResponse,
  PrinterErrorResponse,
} from "./printer.types";

const PRINTER_URL = "http://localhost:9100";

export class ThermalPrinterError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly statusCode?: number,
    public readonly fix?: string,
  ) {
    super(message);
    this.name = "ThermalPrinterError";
  }
}

async function parseErrorResponse(
  response: Response,
): Promise<ThermalPrinterError> {
  const data = (await response
    .json()
    .catch(() => ({}))) as PrinterErrorResponse;

  return new ThermalPrinterError(
    data.detail ?? data.error ?? "Terjadi kesalahan printing",
    data.error,
    response.status,
    data.fix,
  );
}

export async function getPrinterHealth(): Promise<PrinterHealth> {
  let response: Response;

  try {
    response = await fetch(`${PRINTER_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    throw new ThermalPrinterError(
      "Cleanter tidak dapat diakses. Pastikan aplikasi Cleanter berjalan.",
      "bridge_unavailable",
    );
  }

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  return response.json() as Promise<PrinterHealth>;
}

export async function sendPrintRequest(
  content: ReceiptBlock[],
  options: PrintOptions = {},
): Promise<PrintResponse> {
  let response: Response;

  try {
    response = await fetch(`${PRINTER_URL}/print`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(30000),
      body: JSON.stringify({
        content,
        paperWidth: options.paperWidth ?? 58,
        cut: options.cut ?? true,
        ...(options.printer && {
          printer: options.printer,
        }),
        ...(options.reference && {
          reference: options.reference,
        }),
      }),
    });
  } catch {
    throw new ThermalPrinterError(
      "Gagal menghubungi Cleanter. Periksa koneksi dan coba lagi.",
      "bridge_unavailable",
    );
  }

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  return response.json() as Promise<PrintResponse>;
}
