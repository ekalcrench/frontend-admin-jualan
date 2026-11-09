import { useState } from "react";

export default function useDashboardPage() {
  const [endDate, setEndDate] = useState<string | undefined>("");
  const [startDate, setStartDate] = useState<string | undefined>("");

  return {
    endDate,
    startDate,
    setEndDate,
    setStartDate,
  };
}
