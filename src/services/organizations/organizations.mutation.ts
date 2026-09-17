import { Organization } from "@/types/organization";
import { useMutation } from "@tanstack/react-query";
import { CreateOrganization, EditOrganization } from "./organizations.types";
import {
  createOrganization,
  deleteOrganization,
  editOrganization,
} from "./organizations.api";
import { organizationKeys } from "./organizations.constants";

export function useCreateOrganizationMutation() {
  return useMutation<Organization, Error, CreateOrganization>({
    mutationFn: createOrganization,
    onSuccess: (result, payload, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
  });
}

export function useEditOrganizationMutation(id?: string) {
  return useMutation<Organization, Error, EditOrganization>({
    mutationFn: (data) => {
      if (!id) {
        throw new Error("Organization id is required to edit an organization");
      }

      return editOrganization(id, data);
    },
    onSuccess: (result, payload, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: organizationKeys.lists() });
      if (id) {
        context.client.setQueryData(organizationKeys.detail(id), result);
      }
    },
  });
}

export function useDeleteOrganizationMutation() {
  return useMutation<boolean, Error, string>({
    mutationFn: deleteOrganization,
    onSuccess: (result, payload, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: organizationKeys.lists() });
      context.client.invalidateQueries({
        queryKey: organizationKeys.detail(payload),
      });
    },
  });
}
