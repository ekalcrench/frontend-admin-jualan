import axios from "axios";
import { toast } from "sonner";

export function apiErrorHandler(error: any) {
  const message = axios.isAxiosError(error)
    ? error.response?.data?.message
    : undefined;

  if (Array.isArray(message)) {
    message.forEach((msg) => toast.error(msg));
    return;
  }

  toast.error(message || "Bad request");
}
