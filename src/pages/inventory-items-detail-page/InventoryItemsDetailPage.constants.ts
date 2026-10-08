import { defaultParameter } from "@/constants/table";
import { DefaultFilter } from "@/types/table";

export const inventoryLotsDefaultParameter: DefaultFilter = {
  ...defaultParameter,
  sortBy: "-receivedAt",
};
