import axios from "axios";
import { toast } from "sonner";

export function apiErrorHandler(error: any) {
  console.log(">>> error.response?.data:", error.response?.data);
  toast.error(
    axios.isAxiosError(error) ? error.response?.data?.message : "Bad request",
  );
}
