export type PrinterAlignment = "left" | "center" | "right";

export type ReceiptBlock =
  | {
      type: "text";
      text: string;
      align?: PrinterAlignment;
      bold?: boolean;
      underline?: boolean;
      size?: "small" | "normal" | "large";
    }
  | {
      type: "row";
      left: string;
      right: string;
      bold?: boolean;
    }
  | {
      type: "divider";
      char?: string;
    }
  | {
      type: "feed";
      lines?: number;
    }
  | {
      type: "qr";
      data: string;
      size?: number;
      align?: PrinterAlignment;
    }
  | {
      type: "barcode";
      data: string;
      format: "EAN13" | "CODE128" | "CODE39";
      align?: PrinterAlignment;
      height?: number;
    }
  | {
      type: "image";
      base64: string;
      align?: PrinterAlignment;
      dither?: boolean;
    };

export interface PrinterHealth {
  status: "ok";
  version: string;
  printer: {
    connected: boolean;
    name?: string;
    address?: string;
    problem?: string | null;
  };
}

export interface PrintOptions {
  paperWidth?: 58 | 80;
  cut?: boolean;
  printer?: string;
  reference?: string;
}

export interface PrintResponse {
  status: "printed";
  jobId: string;
}

export interface PrinterErrorResponse {
  error?: string;
  detail?: string;
  fix?: string;
}
