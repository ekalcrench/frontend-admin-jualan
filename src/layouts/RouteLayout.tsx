import useAuthStore from "@/store/auth-store";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";
import { LoginPage } from "@/pages/login-page";
import { UsersPage } from "@/pages/UsersPage";
import { paths } from "@/constants/path";
import { RegisterPage } from "@/pages/register-page";
import { RegisterPageVerify } from "@/pages/register-verify-page";

export default function RouteLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      <Route path={paths.login} element={<LoginPage />} />
      <Route path={paths.register} element={<RegisterPage />} />
      <Route path={paths.registerVerify} element={<RegisterPageVerify />} />
      <Route path="/" element={<AdminLayout />}>
        <Route
          index
          element={
            isAuthenticated ? (
              <Navigate to="users" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="users" element={<UsersPage />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}
