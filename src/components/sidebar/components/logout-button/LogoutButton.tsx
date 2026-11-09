import useAuthStore from "@/store/auth-store";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { paths } from "@/constants/path";
import { useLogoutMutation } from "@/services/auth";
import { toast } from "sonner";
import { apiErrorHandler } from "@/utils/api";

export default function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();

  const handleClickLogout = async () => {
    const toastId = toast.loading("Logging  out...");
    try {
      await logoutMutation.mutateAsync(undefined);
    } catch (error) {
      apiErrorHandler(error);
    } finally {
      toast.dismiss(toastId);
      logout();
      navigate(paths.login);
    }
  };

  return (
    <Button
      onClick={handleClickLogout}
      sx={{ width: "100%" }}
      startIcon={<LogoutIcon />}
      loading={logoutMutation.isPending}
    >
      Logout
    </Button>
  );
}
