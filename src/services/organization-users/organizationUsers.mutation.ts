import { useMutation } from "@tanstack/react-query";
import { organizationUserKeys } from "./organizationUsers.constants";
import {
  activateOrganizationUser,
  approveOrganizationUser,
  createOrganizationUser,
  editOrganizationUser,
  suspendOrganizationUser,
} from "./organizationUsers.api";
import {
  CreateOrganizationUser,
  EditOrganizationUser,
  OrganizationUserResponse,
} from "@/types/organizationUser";

export function useCreateOrganizationUserMutation() {
  return useMutation<OrganizationUserResponse, Error, CreateOrganizationUser>({
    mutationFn: createOrganizationUser,
    onSuccess: (result, payload, onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: organizationUserKeys.lists,
      });
    },
  });
}

export function useEditOrganizationUserMutation() {
  return useMutation<OrganizationUserResponse, Error, EditOrganizationUser>({
    mutationFn: editOrganizationUser,
    onSuccess: (result, payload, _onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: organizationUserKeys.lists,
      });
    },
  });
}

export function useApproveOrganizationUserMutation() {
  return useMutation<OrganizationUserResponse, Error, string>({
    mutationFn: approveOrganizationUser,
    onSuccess: (result, id, onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: organizationUserKeys.lists,
      });
    },
  });
}

export function useSuspendOrganizationUserMutation() {
  return useMutation<OrganizationUserResponse, Error, string>({
    mutationFn: suspendOrganizationUser,
    onSuccess: (result, id, onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: organizationUserKeys.lists,
      });
    },
  });
}

export function useActivateOrganizationUserMutation() {
  return useMutation<OrganizationUserResponse, Error, string>({
    mutationFn: activateOrganizationUser,
    onSuccess: (result, id, onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: organizationUserKeys.lists,
      });
    },
  });
}
