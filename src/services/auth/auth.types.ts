export interface AuthRegister {
  email: string;
  password: string;
  name: string;
}

export interface AuthRegisterResponse {
  id: string;
  email: string;
  name: string;
  token?: string;
  message?: string;
}

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
}
