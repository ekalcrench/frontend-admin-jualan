import { useMutation } from "@tanstack/react-query";
import { User, UserOrganizationDetail } from "@/types/user";
import { organizationUserKeys } from "./organizationUsers.constants";
import {
  CreateOrganizationUser,
  EditOrganizationUser,
} from "./organizationUsers.types";
import {
  activateOrganizationUser,
  approveOrganizationUser,
  createOrganizationUser,
  editOrganizationUser,
  suspendOrganizationUser,
} from "./organizationUsers.api";

export function useCreateOrganizationUserMutation() {
  return useMutation<UserOrganizationDetail, Error, CreateOrganizationUser>({
    mutationFn: createOrganizationUser,
    onSuccess: (result, payload, onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: organizationUserKeys.lists(),
      });
    },
  });
}

export function useEditOrganizationUserMutation() {
  return useMutation<UserOrganizationDetail, Error, EditOrganizationUser>({
    mutationFn: editOrganizationUser,
    onSuccess: (result, payload, _onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: organizationUserKeys.lists(),
      });
    },
  });
}

export function useApproveOrganizationUserMutation() {
  return useMutation<UserOrganizationDetail, Error, string>({
    mutationFn: approveOrganizationUser,
    onSuccess: (result, id, onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: organizationUserKeys.lists(),
      });
    },
  });
}

export function useSuspendOrganizationUserMutation() {
  return useMutation<UserOrganizationDetail, Error, string>({
    mutationFn: suspendOrganizationUser,
    onSuccess: (result, id, onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: organizationUserKeys.lists(),
      });
    },
  });
}

export function useActivateOrganizationUserMutation() {
  return useMutation<UserOrganizationDetail, Error, string>({
    mutationFn: activateOrganizationUser,
    onSuccess: (result, id, onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: organizationUserKeys.lists(),
      });
    },
  });
}
