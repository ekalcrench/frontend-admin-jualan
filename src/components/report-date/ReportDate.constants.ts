import { z } from "zod";
import { ReportDateFormValues } from "./ReportDate.types";

export const reportDateFormSchema = z
  .object({
    startDate: z.string().min(1, "Wajib diisi"),
    endDate: z.string().min(1, "Wajib diisi"),
  })
  .superRefine((values, ctx) => {
    const { startDate, endDate } = values;

    // Validasi hanya jika kedua tanggal sudah diisi
    if (!startDate || !endDate) return;

    // Format YYYY-MM-DD bisa dibandingkan secara leksikografis
    if (startDate > endDate) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "Tanggal mulai < tanggal akhir",
      });

      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Tanggal akhir > dari tanggal mulai",
      });
    }
  });

export const emptyReportDateFormValues: ReportDateFormValues = {
  startDate: "",
  endDate: "",
};
