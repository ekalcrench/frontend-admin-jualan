import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  type FieldNamesMarkedBoolean,
  type Resolver,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";
import { fiveMinutes } from "@/constants/time";
import { useProductOptionsQuery } from "@/services/products/products.query";
import {
  useCreateOrderMutation,
  useEditOrderMutation,
} from "@/services/orders/orders.mutation";
import { useOrderByIdQuery } from "@/services/orders/orders.query";
import { fetchProductModifierGroupsByProduct } from "@/services/product-modifiers/productModifiers.api";
import { productModifierKeys } from "@/services/product-modifiers/productModifiers.constants";
import type { LabelValue } from "@/types/generalTypes";
import type { ProductModifierGroupOnProduct } from "@/types/productModifier";
import { apiErrorHandler } from "@/utils/api";
import { areSameIds } from "@/utils/productModifier";
import { emptyOrderFormValues, orderFormSchema } from "./OrderForm.constants";
import type {
  OrderFormProps,
  OrderFormValues,
  OrderItemFormValues,
  OrderItemModifierFormValue,
} from "./OrderForm.types";
import type { ModifierSelectionResult } from "./components/modifier-selection-dialog/ModifierSelectionDialog.types";
import {
  CreateDeliveryOrder,
  CreateDineInOrder,
  CreateOrder,
  CreateOrderItems,
  CreateTakeawayOrder,
  EditDeliveryOrder,
  EditDineInOrder,
  EditOrder,
  EditOrderItems,
  EditTakeawayOrder,
} from "@/types/order";

type DirtyOrderFields = FieldNamesMarkedBoolean<OrderFormValues>;

interface ModifierDialogState {
  index: number;
  product: LabelValue<string>;
  groups: ProductModifierGroupOnProduct[];
  initialOptionIds: string[];
}

function toModifierFormValues(
  modifiers: OrderItemModifierFormValue[],
): OrderItemModifierFormValue[] {
  return modifiers.map((modifier) => ({ ...modifier }));
}

function toDeliveryOrder(
  order: OrderFormValues["deliveryOrder"],
): CreateDeliveryOrder {
  return {
    ...order,
    deliveryFee: order.deliveryFee!,
    latitude: order.latitude!,
    longitude: order.longitude!,
  };
}

function toTakeawayOrder(
  order: OrderFormValues["takeawayOrder"],
): CreateTakeawayOrder {
  return {
    ...order,
    phone: order.phone || undefined,
  };
}

function toDineInOrder(
  order: OrderFormValues["dineInOrder"],
): CreateDineInOrder {
  return {
    tableId: order.tableId,
    ...(order.name && { name: order.name }),
    guestCount: order.guestCount!,
  };
}

function toEditDeliveryOrder(
  order: OrderFormValues["deliveryOrder"],
  dirtyFields: DirtyOrderFields["deliveryOrder"],
): EditDeliveryOrder {
  return {
    ...(dirtyFields?.deliveryFee && { deliveryFee: order.deliveryFee! }),
    ...(dirtyFields?.name && { name: order.name }),
    ...(dirtyFields?.address && { address: order.address }),
    ...(dirtyFields?.phone && { phone: order.phone }),
    ...(dirtyFields?.latitude && { latitude: order.latitude! }),
    ...(dirtyFields?.longitude && { longitude: order.longitude! }),
  };
}

function toEditTakeawayOrder(
  order: OrderFormValues["takeawayOrder"],
  dirtyFields: DirtyOrderFields["takeawayOrder"],
): EditTakeawayOrder {
  return {
    ...(dirtyFields?.name && { name: order.name }),
    ...(dirtyFields?.phone && { phone: order.phone }),
    ...(dirtyFields?.pickUpTime && { pickUpTime: order.pickUpTime }),
  };
}

function toEditDineInOrder(
  order: OrderFormValues["dineInOrder"],
  dirtyFields: DirtyOrderFields["dineInOrder"],
): EditDineInOrder {
  return {
    ...(dirtyFields?.tableId && { tableId: order.tableId }),
    ...(dirtyFields?.name && { name: order.name }),
    ...(dirtyFields?.guestCount && { guestCount: order.guestCount! }),
  };
}

function toCreateOrderItem(item: OrderItemFormValues): CreateOrderItems {
  return {
    productId: item.productId?.value ?? "",
    quantity: item.quantity ?? 0,
    modifierOptionIds: item.modifierOptionIds,
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
        ...(dirtyItem.modifierOptionIds && {
          modifierOptionIds: item.modifierOptionIds,
        }),
      },
    ];
  });
}

export default function useOrderForm(props: OrderFormProps) {
  const createOrder = useCreateOrderMutation();
  const editOrder = useEditOrderMutation();
  const orderQuery = useOrderByIdQuery(props.id);
  const queryClient = useQueryClient();
  const {
    data: productOptions,
    isLoading: isLoadingGetOptions,
    isError: isErrorGetOptions,
    error: errorGetOptions,
  } = useProductOptionsQuery(props.open ?? false, true);

  const [sellingPriceMapping, setSellingPriceMapping] = useState<
    Record<string, number>
  >({});
  const [stockMapping, setStockMapping] = useState<Record<string, number>>({});
  const [modifierDialog, setModifierDialog] =
    useState<ModifierDialogState | null>(null);
  const [checkingProductIndex, setCheckingProductIndex] = useState<
    number | null
  >(null);
  const isFormOpenRef = useRef(props.open);

  useEffect(() => {
    isFormOpenRef.current = props.open;
  }, [props.open]);

  useEffect(() => {
    if (!productOptions?.length) {
      setSellingPriceMapping({});
      setStockMapping({});
      return;
    }
    const _sellingPriceMapping: Record<string, number> = {};
    const _stockMapping: Record<string, number> = {};

    for (const option of productOptions) {
      _sellingPriceMapping[option.id] = option.sellingPrice;
      _stockMapping[option.id] = option.stock;
    }

    setSellingPriceMapping(_sellingPriceMapping);
    setStockMapping(_stockMapping);
  }, [productOptions]);

  const customOrderFormSchema = useMemo(
    () => orderFormSchema(stockMapping),
    [stockMapping],
  );

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    trigger,
    formState: { isSubmitting, dirtyFields },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(customOrderFormSchema) as Resolver<OrderFormValues>,
    mode: "onBlur",
    defaultValues: emptyOrderFormValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "orderItems",
  });
  const orderItemsValues = useWatch({ control, name: "orderItems" });
  const orderType = useWatch({ control, name: "type" });
  const [deletedOrderItemIds, setDeletedOrderItemIds] = useState<string[]>([]);

  useEffect(() => {
    if (!props.open) {
      setModifierDialog(null);
      setCheckingProductIndex(null);
    }
  }, [props.open]);

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

    const order = orderQuery.data;
    reset({
      type: order.type,
      orderNumber: order.orderNumber,
      deliveryOrder: {
        deliveryFee: order.deliveryOrder?.deliveryFee ?? null,
        name: order.deliveryOrder?.name ?? "",
        address: order.deliveryOrder?.address ?? "",
        phone: order.deliveryOrder?.phone ?? "",
        latitude: order.deliveryOrder
          ? Number(order.deliveryOrder.latitude)
          : null,
        longitude: order.deliveryOrder
          ? Number(order.deliveryOrder.longitude)
          : null,
      },
      takeawayOrder: {
        name: order.takeawayOrder?.name ?? "",
        phone: order.takeawayOrder?.phone ?? "",
        pickUpTime: order.takeawayOrder?.pickUpTime ?? "",
      },
      dineInOrder: {
        tableId: order.dineInOrder?.tableId ?? "",
        name: order.dineInOrder?.name ?? "",
        guestCount: order.dineInOrder?.guestCount ?? null,
      },
      orderItems: order.orderItems.map((item) => {
        const modifiers = item.modifiers ?? [];

        return {
          id: item.id,
          productId: {
            value: item.product.id,
            label: item.product.name,
          },
          quantity: item.quantity,
          modifierOptionIds: modifiers
            .map((modifier) => modifier.modifierOptionId)
            .filter((optionId): optionId is string => Boolean(optionId)),
          modifiers: toModifierFormValues(
            modifiers.map((modifier) => ({
              modifierGroupId: modifier.modifierGroupId,
              modifierOptionId: modifier.modifierOptionId,
              groupName: modifier.groupName,
              optionName: modifier.optionName,
              unitPrice: modifier.unitPrice,
            })),
          ),
        };
      }),
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
    isLoadingGetData ||
    checkingProductIndex !== null;

  const dialogProduct = modifierDialog
    ? productOptions?.find(
        (product) => product.id === modifierDialog.product.value,
      )
    : undefined;

  const handleRemoveOrderItem = (index: number) => {
    const item = orderItemsValues[index];
    if (item?.id) {
      setDeletedOrderItemIds((previous) => [...previous, item.id!]);
    }
    remove(index);
  };

  const handleProductSelection = async (
    index: number,
    product: LabelValue<string> | null,
  ) => {
    const currentProduct = getValues(`orderItems.${index}.productId`);

    if (!product) {
      setValue(`orderItems.${index}.productId`, null, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue(`orderItems.${index}.modifierOptionIds`, [], {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue(`orderItems.${index}.modifiers`, [], { shouldDirty: true });
      return;
    }

    if (currentProduct?.value === product.value) return;

    setCheckingProductIndex(index);
    try {
      const response = await queryClient.fetchQuery({
        queryKey: productModifierKeys.assignment(product.value, true),
        queryFn: () =>
          fetchProductModifierGroupsByProduct(product.value, true),
        staleTime: fiveMinutes,
      });

      if (!isFormOpenRef.current) return;

      if (response.modifierGroups.length > 0) {
        setModifierDialog({
          index,
          product,
          groups: response.modifierGroups,
          initialOptionIds: [],
        });
        return;
      }

      setValue(`orderItems.${index}.productId`, product, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue(`orderItems.${index}.modifierOptionIds`, [], {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue(`orderItems.${index}.modifiers`, [], { shouldDirty: true });
      void trigger(`orderItems.${index}.productId`);
    } catch (error) {
      apiErrorHandler(error);
    } finally {
      setCheckingProductIndex(null);
    }
  };

  const handleOpenModifierDialog = async (index: number) => {
    const product = getValues(`orderItems.${index}.productId`);
    if (!product) {
      toast.info("Pilih produk terlebih dahulu");
      return;
    }

    setCheckingProductIndex(index);
    try {
      const response = await queryClient.fetchQuery({
        queryKey: productModifierKeys.assignment(product.value, true),
        queryFn: () =>
          fetchProductModifierGroupsByProduct(product.value, true),
        staleTime: fiveMinutes,
      });

      if (!isFormOpenRef.current) return;

      if (!response.modifierGroups.length) {
        toast.info("Produk ini tidak memiliki variasi");
        return;
      }

      setModifierDialog({
        index,
        product,
        groups: response.modifierGroups,
        initialOptionIds:
          getValues(`orderItems.${index}.modifierOptionIds`) ?? [],
      });
    } catch (error) {
      apiErrorHandler(error);
    } finally {
      setCheckingProductIndex(null);
    }
  };

  const handleConfirmModifiers = (result: ModifierSelectionResult) => {
    if (!modifierDialog) return;

    const { index, product } = modifierDialog;
    const currentProduct = getValues(`orderItems.${index}.productId`);
    const currentOptionIds =
      getValues(`orderItems.${index}.modifierOptionIds`) ?? [];

    if (
      currentProduct?.value === product.value &&
      areSameIds(currentOptionIds, result.optionIds)
    ) {
      setModifierDialog(null);
      return;
    }

    setValue(`orderItems.${index}.productId`, product, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(`orderItems.${index}.modifierOptionIds`, result.optionIds, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(`orderItems.${index}.modifiers`, result.modifiers, {
      shouldDirty: true,
    });
    setModifierDialog(null);
    void trigger(`orderItems.${index}.productId`);
  };

  const handleCloseModifierDialog = () => {
    setModifierDialog(null);
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
        const typeChanged = values.type !== orderQuery.data?.type;
        const editPayload: EditOrder = {
          id: props.id,
          ...(dirtyFields.type && values.type != null && { type: values.type }),
          ...(dirtyFields.orderNumber && {
            orderNumber: values.orderNumber,
          }),
          ...(values.type === "DELIVERY" &&
            (typeChanged || dirtyFields.deliveryOrder) && {
              deliveryOrder: typeChanged
                ? toDeliveryOrder(values.deliveryOrder)
                : toEditDeliveryOrder(
                    values.deliveryOrder,
                    dirtyFields.deliveryOrder,
                  ),
            }),
          ...(values.type === "TAKEAWAY" &&
            (typeChanged || dirtyFields.takeawayOrder) && {
              takeawayOrder: typeChanged
                ? toTakeawayOrder(values.takeawayOrder)
                : toEditTakeawayOrder(
                    values.takeawayOrder,
                    dirtyFields.takeawayOrder,
                  ),
            }),
          ...(values.type === "DINE_IN" &&
            (typeChanged || dirtyFields.dineInOrder) && {
              dineInOrder: typeChanged
                ? toDineInOrder(values.dineInOrder)
                : toEditDineInOrder(
                    values.dineInOrder,
                    dirtyFields.dineInOrder,
                  ),
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
          type: values.type ?? "DELIVERY",
          orderNumber: values.orderNumber,
          orderItems: values.orderItems.map(toCreateOrderItem),
        };
        if (values.type === "DELIVERY") {
          createPayload.deliveryOrder = toDeliveryOrder(values.deliveryOrder);
        }
        if (values.type === "TAKEAWAY") {
          createPayload.takeawayOrder = toTakeawayOrder(values.takeawayOrder);
        }
        if (values.type === "DINE_IN") {
          createPayload.dineInOrder = toDineInOrder(values.dineInOrder);
        }
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
    orderType,
    orderItemsValues,
    isLoading,
    isLoadingGetOptions,
    sellingPriceMapping,
    stockMapping,
    modifierDialog,
    modifierDialogProductName:
      dialogProduct?.name ?? modifierDialog?.product.label ?? "",
    modifierDialogBasePrice: dialogProduct?.sellingPrice ?? 0,
    modifierDialogGroups: modifierDialog?.groups ?? [],
    modifierDialogInitialOptionIds: modifierDialog?.initialOptionIds ?? [],
    checkingProductIndex,
    append,
    handleRemoveOrderItem,
    handleProductSelection,
    handleOpenModifierDialog,
    handleConfirmModifiers,
    handleCloseModifierDialog,
    handleSubmit,
    onSubmit,
  };
}
