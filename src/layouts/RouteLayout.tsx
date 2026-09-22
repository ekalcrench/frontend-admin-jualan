import useAuthStore from "@/store/auth-store";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";
import LoginPage from "@/pages/login-page";
import UsersPage from "@/pages/users-page";
import { paths } from "@/constants/path";
import RegisterPage from "@/pages/register-page";
import RegisterPageVerify from "@/pages/register-verify-page";
import UmkmPage from "@/pages/umkm-page";
import AllUsersPage from "@/pages/all-users-page";
import DashboardPage from "@/pages/dashboard-page";
import SelectOrganizationsPage from "@/pages/select-organizations-page";

function ProtectedRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return accessToken ? <Outlet /> : <Navigate to={paths.login} replace />;
}

function GuestRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const organization = useAuthStore((state) => state.organization);

  return accessToken ? (
    <Navigate to={organization ? paths.dashboard : paths.login} replace />
  ) : (
    <Outlet />
  );
}

function OrganizationRoute() {
  const organization = useAuthStore((state) => state.organization);

  return organization ? (
    <Outlet />
  ) : (
    <Navigate to={paths.selectOrganizations} replace />
  );
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
        <Route
          path={paths.selectOrganizations}
          element={<SelectOrganizationsPage />}
        />

        <Route element={<OrganizationRoute />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to={paths.dashboard} replace />} />
            <Route path={paths.dashboard} element={<DashboardPage />} />
            <Route path={paths.users} element={<UsersPage />} />
            <Route path={paths.allUsers} element={<AllUsersPage />} />
            <Route path={paths.umkm} element={<UmkmPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={paths.users} replace />} />
      </Route>
    </Routes>
  );
}
