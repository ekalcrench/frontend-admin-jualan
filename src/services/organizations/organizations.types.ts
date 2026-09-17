export interface CreateOrganization {
  name: string;
  address: string;
  email: string;
  phone: string;
  file: File;
}

export interface EditOrganization extends Partial<CreateOrganization> {
  logoUrl?: string;
}
