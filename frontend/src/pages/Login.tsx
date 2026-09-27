import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

export function Login() {
  const { login, loading } = useAuth();
  const { t, toggleLang, lang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@fintrack.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? t("auth.loginError"));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-slate-50 to-brand-100 dark:from-slate-950 dark:via-slate-900 dark:to-brand-950 relative">
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full bg-white/70 dark:bg-slate-800/70 shadow-soft text-sm"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        <button
          onClick={toggleLang}
          className="px-3 h-9 rounded-full bg-white/70 dark:bg-slate-800/70 shadow-soft text-sm font-medium"
        >
          {lang === "pt" ? "PT" : "EN"}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-soft w-full max-w-sm border border-slate-100 dark:border-slate-800"
      >
        <h1 className="text-2xl font-bold mb-1 bg-gradient-to-br from-brand-500 to-brand-700 bg-clip-text text-transparent">
          💰 FinTrack
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">{t("auth.loginTitle")}</p>

        {error && (
          <div className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm p-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <label className="block text-sm font-medium mb-1">{t("auth.email")}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 mb-4 text-sm"
          required
        />

        <label className="block text-sm font-medium mb-1">{t("auth.password")}</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 mb-6 text-sm"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-60 transition"
        >
          {loading ? t("auth.loginLoading") : t("auth.loginButton")}
        </button>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 text-center">
          {t("auth.noAccount")}{" "}
          <Link to="/register" className="text-brand-600 dark:text-brand-400 font-medium">
            {t("auth.signUp")}
          </Link>
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 text-center">
          {t("auth.demoHint")}
        </p>
      </form>
    </div>
  );
}
