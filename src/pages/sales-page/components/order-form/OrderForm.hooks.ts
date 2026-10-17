import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  type FieldNamesMarkedBoolean,
  type Resolver,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";
import {
  useProductOptionsQuery,
  useProductQuery,
} from "@/services/products/products.query";
import {
  useCreateProductMutation,
  useEditProductMutation,
} from "@/services/orders/orders.mutation";
import { useOrderByIdQuery } from "@/services/orders/orders.query";
import type {
  CreateOrder,
  CreateOrderItems,
  EditOrder,
  EditOrderItems,
} from "@/services/orders/orders.types";
import { apiErrorHandler } from "@/utils/api";
import { emptyOrderFormValues, orderFormSchema } from "./OrderForm.constants";
import type {
  OrderFormProps,
  OrderFormValues,
  OrderItemFormValues,
} from "./OrderForm.types";

function toCreateOrderItem(item: OrderItemFormValues): CreateOrderItems {
  return {
    productId: item.productId?.value ?? "",
    quantity: item.quantity ?? 0,
  };
}

function toEditOrderItems(
  items: OrderItemFormValues[],
  dirtyItems: FieldNamesMarkedBoolean<OrderFormValues>["orderItems"],
): EditOrderItems[] {
  return items.flatMap<EditOrderItems>((item, index) => {
    if (!item.id) return [toCreateOrderItem(item)];

    const dirtyItem = dirtyItems?.[index];
    if (!dirtyItem) return [];

    return [
      {
        id: item.id,
        ...(dirtyItem.productId && {
          productId: item.productId?.value ?? "",
        }),
        ...(dirtyItem.quantity && { quantity: item.quantity ?? 0 }),
      },
    ];
  });
}

export default function useOrderForm(props: OrderFormProps) {
  const createOrder = useCreateProductMutation();
  const editOrder = useEditProductMutation();
  const orderQuery = useOrderByIdQuery(props.id);
  const {
    data: productOptions,
    isLoading: isLoadingGetOptions,
    isError: isErrorGetOptions,
    error: errorGetOptions,
  } = useProductOptionsQuery(props.open ?? false);

  const [sellingPriceMapping, setSellingPriceMapping] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    console.log(">>> sellingPriceMapping : ", sellingPriceMapping);
  }, [sellingPriceMapping]);

  useEffect(() => {
    console.log(">>> productOptions : ", productOptions);
    if (!productOptions?.length) {
      setSellingPriceMapping({});
      return;
    }

    setSellingPriceMapping(
      Object.fromEntries(
        productOptions.map((option) => [option.id, option.sellingPrice]),
      ),
    );
  }, [productOptions]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, dirtyFields },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema) as Resolver<OrderFormValues>,
    mode: "onBlur",
    defaultValues: emptyOrderFormValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "orderItems",
  });
  const orderItemsValues = useWatch({ control, name: "orderItems" });
  const [deletedOrderItemIds, setDeletedOrderItemIds] = useState<string[]>([]);

  useEffect(() => {
    console.log(">>> orderItemsValues : ", orderItemsValues);
  }, [orderItemsValues]);

  useEffect(() => {
    if (!props.open) {
      setDeletedOrderItemIds([]);
      return;
    }
    if (!props.id) {
      reset(emptyOrderFormValues);
      return;
    }
    if (!orderQuery.data) return;

    reset({
      orderNumber: orderQuery.data.orderNumber,
      orderItems: orderQuery.data.orderItems.map((item) => ({
        id: item.id,
        productId: {
          value: item.product.id,
          label: item.product.name,
        },
        quantity: item.quantity,
      })),
    });
  }, [props.id, props.open, orderQuery.data, reset]);

  const isLoadingGetData = Boolean(
    props.id &&
    (!orderQuery.data || orderQuery.isPending || orderQuery.isFetching),
  );
  const isLoading =
    isSubmitting ||
    createOrder.isPending ||
    editOrder.isPending ||
    isLoadingGetData;

  const handleRemoveOrderItem = (index: number) => {
    const item = orderItemsValues[index];
    if (item?.id) {
      setDeletedOrderItemIds((previous) => [...previous, item.id!]);
    }
    remove(index);
  };

  const onSubmit = async (values: OrderFormValues) => {
    if (
      props.id &&
      Object.keys(dirtyFields).length === 0 &&
      deletedOrderItemIds.length === 0
    ) {
      toast.info("Tidak ada perubahan untuk disimpan");
      return;
    }

    const toastId = toast.loading(
      props.id ? "Memperbarui penjualan..." : "Membuat penjualan...",
    );
    try {
      if (props.id) {
        const hasNewOrderItems = values.orderItems.some((item) => !item.id);
        const editPayload: EditOrder = {
          id: props.id,
          ...(dirtyFields.orderNumber && {
            orderNumber: values.orderNumber,
          }),
          ...((dirtyFields.orderItems ||
            hasNewOrderItems ||
            deletedOrderItemIds.length > 0) && {
            orderItems: toEditOrderItems(
              values.orderItems,
              dirtyFields.orderItems,
            ),
          }),
          ...(deletedOrderItemIds.length > 0 && { deletedOrderItemIds }),
        };
        await editOrder.mutateAsync(editPayload);
      } else {
        const createPayload: CreateOrder = {
          orderNumber: values.orderNumber,
          orderItems: values.orderItems.map(toCreateOrderItem),
        };
        await createOrder.mutateAsync(createPayload);
      }

      toast.success(
        props.id
          ? "Penjualan berhasil diperbarui"
          : "Penjualan berhasil ditambahkan",
      );
      props.setIsFormOpen(false);
    } catch (submitError) {
      apiErrorHandler(submitError);
    } finally {
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    if (orderQuery.isError && orderQuery.error) {
      apiErrorHandler(orderQuery.error);
    }
  }, [orderQuery.isError, orderQuery.error]);

  useEffect(() => {
    if (isErrorGetOptions && errorGetOptions) apiErrorHandler(errorGetOptions);
  }, [isErrorGetOptions, errorGetOptions]);

  return {
    control,
    fields,
    productOptions,
    orderItemsValues,
    isLoading,
    isLoadingGetOptions,
    sellingPriceMapping,
    append,
    handleRemoveOrderItem,
    handleSubmit,
    onSubmit,
  };
}
