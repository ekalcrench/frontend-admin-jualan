export interface CreateOrganization {
  name: string;
  address: string;
  email: string;
  phone: string;
  logoBase64: string;
}

export type EditOrganization = Partial<CreateOrganization>;
