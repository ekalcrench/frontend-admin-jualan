import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm } from "react-hook-form";
import {
  reportDateFormSchema,
  emptyReportDateFormValues,
} from "./ReportDate.constants";
import {
  ReportDateFormValues,
  ReportDateProps,
  ReportDateType,
} from "./ReportDate.types";
import { useState } from "react";
import { getDayDifference } from "@/utils/dateTime";

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDefaultReportDateType = (
  startDate?: string,
  endDate?: string,
): ReportDateType => {
  if (!startDate || !endDate) return "ALL_TIME";

  const dayDifference = getDayDifference(startDate, endDate);

  if (dayDifference === 0) return "TODAY";
  if (dayDifference === 7) return "A_WEEK";
  if (dayDifference === 31 || dayDifference === 30) return "A_MONTH";
  if (dayDifference === 365 || dayDifference === 366) return "A_YEAR";

  return "CUSTOM";
};

export default function useReportDate({
  endDate,
  startDate,
  setEndDate,
  setStartDate,
}: ReportDateProps) {
  const { control, reset, handleSubmit, setValue } =
    useForm<ReportDateFormValues>({
      resolver: zodResolver(
        reportDateFormSchema,
      ) as Resolver<ReportDateFormValues>,
      mode: "onChange",
      defaultValues: emptyReportDateFormValues,
    });

  const [openCollapse, setOpenCollapse] = useState<boolean>(false);
  const [reportDateType, setReportDateType] = useState<ReportDateType>(
    getDefaultReportDateType(startDate, endDate),
  );

  const setReportDate = (startDate: Date, endDate: Date) => {
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    setValue("startDate", formattedStartDate, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("endDate", formattedEndDate, {
      shouldDirty: true,
      shouldValidate: true,
    });

    return { formattedStartDate, formattedEndDate };
  };

  const handleClickAllTime = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setOpenCollapse(false);
    setReportDateType("ALL_TIME");
  };

  const handleClickToday = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);

    const { formattedEndDate, formattedStartDate } = setReportDate(
      startDate,
      endDate,
    );
    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
    setOpenCollapse(false);
    setReportDateType("TODAY");
  };

  const handleClickOneWeek = () => {
    const endDate = new Date();
    const startDate = new Date(endDate);

    startDate.setDate(startDate.getDate() - 7);

    const { formattedEndDate, formattedStartDate } = setReportDate(
      startDate,
      endDate,
    );
    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
    setOpenCollapse(false);
    setReportDateType("A_WEEK");
  };

  const handleClickOneMonth = () => {
    const endDate = new Date();
    const startDate = new Date(endDate);

    startDate.setMonth(startDate.getMonth() - 1);

    const { formattedEndDate, formattedStartDate } = setReportDate(
      startDate,
      endDate,
    );
    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
    setOpenCollapse(false);
    setReportDateType("A_MONTH");
  };

  const handleClickOneYear = () => {
    const endDate = new Date();
    const startDate = new Date(endDate);

    startDate.setFullYear(startDate.getFullYear() - 1);

    const { formattedEndDate, formattedStartDate } = setReportDate(
      startDate,
      endDate,
    );
    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
    setOpenCollapse(false);
    setReportDateType("A_YEAR");
  };

  const handleClickCustomDate = () => {
    reset(emptyReportDateFormValues);
    setOpenCollapse(true);
    setReportDateType("CUSTOM");
  };

  const onSubmit = (values: ReportDateFormValues) => {
    setStartDate(values.startDate);
    setEndDate(values.endDate);
  };

  return {
    control,
    openCollapse,
    reportDateType,
    handleClickAllTime,
    handleClickCustomDate,
    handleClickOneMonth,
    handleClickOneWeek,
    handleClickOneYear,
    handleClickToday,
    handleSubmit,
    onSubmit,
  };
}
