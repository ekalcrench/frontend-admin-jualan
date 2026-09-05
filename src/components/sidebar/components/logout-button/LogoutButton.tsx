import useAuthStore from "@/store/auth-store";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { paths } from "@/constants/path";

export default function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => {
        logout();
        navigate(paths.login);
      }}
      sx={{ width: "100%" }}
      startIcon={<LogoutIcon />}
    >
      Logout
    </Button>
  );
}
