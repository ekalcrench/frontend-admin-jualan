import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm } from "react-hook-form";
import {
  reportDateFormSchema,
  emptyReportDateFormValues,
} from "./ReportDate.constants";
import { ReportDateFormValues, ReportDateType } from "./ReportDate.types";
import { useState } from "react";
import useCashTransactionStore from "@/store/cash-transaction-store";

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function useReportDate() {
  const { control, reset, handleSubmit, setValue } =
    useForm<ReportDateFormValues>({
      resolver: zodResolver(
        reportDateFormSchema,
      ) as Resolver<ReportDateFormValues>,
      mode: "onChange",
      defaultValues: emptyReportDateFormValues,
    });

  const cashTransactionStore = useCashTransactionStore();

  const [openCollapse, setOpenCollapse] = useState<boolean>(false);
  const [reportDateType, setReportDateType] = useState<ReportDateType>();

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
    cashTransactionStore.setStartDate(formattedStartDate);
    cashTransactionStore.setEndDate(formattedEndDate);
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
    cashTransactionStore.setStartDate(formattedStartDate);
    cashTransactionStore.setEndDate(formattedEndDate);
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
    cashTransactionStore.setStartDate(formattedStartDate);
    cashTransactionStore.setEndDate(formattedEndDate);
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
    cashTransactionStore.setStartDate(formattedStartDate);
    cashTransactionStore.setEndDate(formattedEndDate);
    setOpenCollapse(false);
    setReportDateType("A_YEAR");
  };

  const handleClickCustomDate = () => {
    reset(emptyReportDateFormValues);
    setOpenCollapse(true);
    setReportDateType("CUSTOM");
  };

  const onSubmit = (values: ReportDateFormValues) => {
    cashTransactionStore.setStartDate(values.startDate);
    cashTransactionStore.setEndDate(values.endDate);
  };

  return {
    control,
    openCollapse,
    reportDateType,
    handleClickCustomDate,
    handleClickOneMonth,
    handleClickOneWeek,
    handleClickOneYear,
    handleClickToday,
    handleSubmit,
    onSubmit,
  };
}
