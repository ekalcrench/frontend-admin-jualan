import { useMutation } from "@tanstack/react-query";
import { User } from "@/types/user";
import { activateUser, editUser, suspendUser } from "./users.api";
import { userKeys } from "./users.constants";
import { EditUser } from "./users.types";

export function useEditUserMutation() {
  return useMutation<User, Error, EditUser>({
    mutationFn: editUser,
    onSuccess: (result, payload, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: userKeys.lists() });
      context.client.setQueryData(userKeys.detail(payload.id), result);
    },
  });
}

export function useSuspendUserMutation() {
  return useMutation<User, Error, string>({
    mutationFn: suspendUser,
    onSuccess: (result, id, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: userKeys.lists() });
      context.client.setQueryData(userKeys.detail(id), result);
    },
  });
}

export function useActivateUserMutation() {
  return useMutation<User, Error, string>({
    mutationFn: activateUser,
    onSuccess: (result, id, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: userKeys.lists() });
      context.client.setQueryData(userKeys.detail(id), result);
    },
  });
}
