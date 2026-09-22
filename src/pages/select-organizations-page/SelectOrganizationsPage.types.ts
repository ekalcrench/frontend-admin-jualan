import z from "zod";
import { selectOrganizationSchema } from "./SelectOrganizationsPage.constants";

export type SelectOrganizationFormValues = z.infer<
  typeof selectOrganizationSchema
>;
