import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

export function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLanguage();
  const navigate = useNavigate();

  const links = [
    { to: "/", label: t("nav.dashboard") },
    { to: "/transactions", label: t("nav.transactions") },
    { to: "/budgets", label: t("nav.budgets") },
    { to: "/accounts", label: t("nav.accounts") },
    { to: "/categories", label: t("nav.categories") },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-slate-900 dark:bg-black text-slate-100 flex flex-col p-5">
        <h1 className="text-xl font-bold mb-8 flex items-center gap-2">
          <span className="bg-gradient-to-br from-brand-400 to-brand-600 bg-clip-text text-transparent">
            💰 FinTrack
          </span>
        </h1>
        <nav className="flex flex-col gap-1 flex-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm transition ${
                  isActive ? "bg-brand-600 text-white" : "hover:bg-slate-800 text-slate-300"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            className="flex-1 bg-slate-800 hover:bg-slate-700 rounded-lg py-2 text-sm"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button
            onClick={toggleLang}
            title="PT / EN"
            className="flex-1 bg-slate-800 hover:bg-slate-700 rounded-lg py-2 text-sm font-medium"
          >
            {lang === "pt" ? "🇧🇷 PT" : "🇺🇸 EN"}
          </button>
        </div>

        <div className="border-t border-slate-700 pt-4 text-sm">
          <p className="text-slate-400 mb-2">{user?.name}</p>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="text-red-400 hover:text-red-300"
          >
            {t("nav.logout")}
          </button>
        </div>
      </aside>
      <main className="flex-1 bg-slate-50 dark:bg-slate-950 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
