import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useAuthStore } from "../store/authStore";

export function AdminLayout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold">Admin Jualan</h1>
            <p className="text-sm text-slate-500">ERP dashboard starter</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              {user?.name ?? "Admin"}
            </span>
            <Button variant="outlined" size="small" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl gap-6 px-6 py-8">
        <nav className="hidden w-72 shrink-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:block">
          <p className="text-sm font-semibold text-slate-600">Navigation</p>
          <ul className="mt-4 space-y-2 text-slate-700">
            <li>
              <a
                href="/users"
                className="block rounded-2xl px-3 py-2 transition hover:bg-slate-50"
              >
                Users
              </a>
            </li>
          </ul>
        </nav>

        <section className="flex-1">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
