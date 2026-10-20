import { useQuery } from "@tanstack/react-query";
import { fiveMinutes } from "@/constants/time";
import { PaginatedData } from "@/types/table";
import {
  PreparationFilterPayload,
  PreparationResponse,
} from "@/types/preparations";
import { fetchPreparations, fetchPreparationById } from "./preparations.api";
import { preparationsKeys } from "./preparations.constants";

export function usePreparationQuery(payload: PreparationFilterPayload) {
  return useQuery<PaginatedData<PreparationResponse>>({
    queryKey: preparationsKeys.list(payload),
    queryFn: () => fetchPreparations(payload),
    staleTime: fiveMinutes,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function usePreparationByIdQuery(id?: string) {
  return useQuery<PreparationResponse>({
    queryKey: preparationsKeys.detail(id),
    queryFn: () => {
      if (!id) {
        throw new Error("Preparation id is required");
      }

      return fetchPreparationById(id);
    },
    enabled: Boolean(id),
    staleTime: fiveMinutes,
  });
}
