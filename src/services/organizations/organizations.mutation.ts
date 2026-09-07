import { Organization } from "@/types/organization";
import { useMutation } from "@tanstack/react-query";
import { CreateOrganization } from "./organizations.types";
import { createOrganization } from "./organizations.api";

export function useOrganizationsMutation() {
  return useMutation<Organization, Error, CreateOrganization>({
    mutationFn: createOrganization,
    onSuccess: (result, variables, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}
