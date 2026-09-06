import useAuthStore from "@/store/auth-store";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";
import { LoginPage } from "@/pages/login-page";
import { UsersPage } from "@/pages/users-page";
import { paths } from "@/constants/path";
import { RegisterPage } from "@/pages/register-page";
import { RegisterPageVerify } from "@/pages/register-verify-page";
import { UmkmPage } from "@/pages/umkm-page";

function ProtectedRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return accessToken ? <Outlet /> : <Navigate to={paths.login} replace />;
}

function GuestRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return accessToken ? <Navigate to={paths.users} replace /> : <Outlet />;
}

export default function RouteLayout() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path={paths.login} element={<LoginPage />} />
        <Route path={paths.register} element={<RegisterPage />} />
        <Route path={paths.registerVerify} element={<RegisterPageVerify />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to={paths.users} replace />} />
          <Route path={paths.users} element={<UsersPage />} />
          <Route path={paths.umkm} element={<UmkmPage />} />
        </Route>
        <Route path="*" element={<Navigate to={paths.users} replace />} />
      </Route>
    </Routes>
  );
}
