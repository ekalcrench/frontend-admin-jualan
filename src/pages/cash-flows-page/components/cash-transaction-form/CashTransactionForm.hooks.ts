import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useCreateCashTransactionMutation,
  useEditCashTransactionMutation,
} from "@/services/cash-transactions/cashTransactions.mutation";
import { useCashTransactionByIdQuery } from "@/services/cash-transactions/cashTransactions.query";
import {
  CreateCashTransaction,
  EditCashTransaction,
} from "@/services/cash-transactions/cashTransactions.types";
import { apiErrorHandler } from "@/utils/api";
import {
  cashTransactionFormSchema,
  emptyCashTransactionFormValues,
} from "./CashTransactionForm.constants";
import {
  CashTransactionFormProps,
  CashTransactionFormValues,
} from "./CashTransactionForm.types";
import {
  cashTransactionType,
  isEditableCashTransactionType,
} from "@/constants/cashTransaction";

export default function useCashTransactionForm(
  props: CashTransactionFormProps,
) {
  const createCashTransaction = useCreateCashTransactionMutation();
  const editCashTransaction = useEditCashTransactionMutation();
  const cashTransactionQuery = useCashTransactionByIdQuery(props.id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, dirtyFields },
  } = useForm<CashTransactionFormValues>({
    resolver: zodResolver(
      cashTransactionFormSchema,
    ) as Resolver<CashTransactionFormValues>,
    mode: "onBlur",
    defaultValues: emptyCashTransactionFormValues,
  });

  useEffect(() => {
    if (!props.open) return;
    if (!props.id) {
      reset(emptyCashTransactionFormValues);
      return;
    }
    if (!cashTransactionQuery.data) return;

    reset({
      type: isEditableCashTransactionType(cashTransactionQuery.data.type)
        ? cashTransactionQuery.data.type
        : undefined,
      amount: Number(cashTransactionQuery.data.amount),
      transactionAt: cashTransactionQuery.data.transactionAt,
      description: cashTransactionQuery.data.description ?? "",
    });
  }, [props.id, props.open, cashTransactionQuery.data, reset]);

  const isLoadingGetData = Boolean(
    props.id &&
    (!cashTransactionQuery.data ||
      cashTransactionQuery.isPending ||
      cashTransactionQuery.isFetching),
  );
  const isLoading =
    isSubmitting ||
    createCashTransaction.isPending ||
    editCashTransaction.isPending ||
    isLoadingGetData;
  const canEditTransaction =
    !props.id || isEditableCashTransactionType(cashTransactionQuery.data?.type);

  const onSubmit = async (values: CashTransactionFormValues) => {
    if (props.id) {
      if (!isEditableCashTransactionType(cashTransactionQuery.data?.type)) {
        toast.error("Transaksi ini tidak dapat diubah");
        return;
      }

      if (Object.keys(dirtyFields).length === 0) {
        toast.info("Tidak ada perubahan untuk disimpan");
        return;
      }
    }

    const toastId = toast.loading(
      props.id ? "Memperbarui arus kas..." : "Membuat arus kas...",
    );

    try {
      if (props.id) {
        const payload: EditCashTransaction = {
          id: props.id,
          ...(dirtyFields.type && { type: values.type }),
          ...(dirtyFields.amount && { amount: values.amount ?? 0 }),
          ...(dirtyFields.transactionAt && {
            transactionAt: values.transactionAt,
          }),
          ...(dirtyFields.description && {
            description: values.description.trim(),
          }),
        };
        await editCashTransaction.mutateAsync(payload);
      } else {
        const payload: CreateCashTransaction = {
          type: values.type ?? cashTransactionType.INVESTMENT,
          amount: values.amount ?? 0,
          transactionAt: values.transactionAt,
          description: values.description.trim() || undefined,
        };
        await createCashTransaction.mutateAsync(payload);
      }

      toast.success(
        props.id ? "Arus kas berhasil diperbarui" : "Arus kas berhasil dibuat",
      );
      props.setIsFormOpen(false);
    } catch (submitError) {
      apiErrorHandler(submitError);
    } finally {
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    if (cashTransactionQuery.isError && cashTransactionQuery.error) {
      apiErrorHandler(cashTransactionQuery.error);
    }
  }, [cashTransactionQuery.isError, cashTransactionQuery.error]);

  return {
    canEditTransaction,
    control,
    isLoading,
    handleSubmit,
    onSubmit,
  };
}
