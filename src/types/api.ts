export interface BaseApiResponse {
  createdAt: string;
  updatedAt: string;
}

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error: string;
}
