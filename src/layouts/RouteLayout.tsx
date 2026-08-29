import useAuthStore from "@/store/auth-store";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";
import { LoginPage } from "@/pages/login-page";
import { UsersPage } from "@/pages/UsersPage";

export default function RouteLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
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
