export function formatLocalDate(date: string | Date): string {
  const value = new Date(date);

  const time = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(value);

  const datePart = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);

  return `${time}, ${datePart}`;
}

export function formatLocalTime(date: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(date));
}

export function formatLocalDateOnly(date: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export const getDayDifference = (
  startDate: string,
  endDate: string,
): number => {
  const start = new Date(`${startDate.slice(0, 10)}T00:00:00Z`);
  const end = new Date(`${endDate.slice(0, 10)}T00:00:00Z`);
  const dayDifference = Math.max(
    0,
    Math.round((end.getTime() - start.getTime()) / 86_400_000),
  );

  return dayDifference;
};

export const getPreviousPeriodLabel = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return "periode sebelumnya";

  const dayDifference = getDayDifference(startDate, endDate);

  if (dayDifference === 0) return "kemarin";
  if (dayDifference === 7) return "minggu lalu";
  if (dayDifference === 31 || dayDifference === 30) return "bulan lalu";
  if (dayDifference === 365 || dayDifference === 366) return "tahun lalu";

  return `${dayDifference + 1} hari lalu`;
};

export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
