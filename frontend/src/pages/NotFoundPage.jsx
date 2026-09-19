import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Compass,
  Home,
  ArrowLeft,
  Layers,
  ShieldCheck,
  BellRing
} from "lucide-react";
import ThemeToggle from "../components/shared/ThemeToggle";
import LanguageSelector from "../components/shared/LanguageSelector";

/**
 * NotFoundPage (404 Error Page)
 * Production-grade sovereign custom 404 page for NagrikPath.
 * Features:
 *   - Obsidian 3-tier dark theme (#08090A, #0F1115, #16191F, border-white/[0.08]) + neutral light mode
 *   - Subtle ambient glow background
 *   - Monospace telemetry status badge (ROUTE_UNRESOLVED // STATUS 404)
 *   - Sovereign citizen recovery action grid (Citizen Hub, Yojna Setu, History Back)
 *   - Quick access directory for federated services
 *   - 100% Lucide SVG iconography (zero emojis, zero font ligatures)
 */
export default function NotFoundPage() {
  const navigate = useNavigate();
  const hasSession = Boolean(localStorage.getItem("nagrikpath_session"));

  const handleGoHome = () => {
    navigate(hasSession ? "/home" : "/");
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(hasSession ? "/home" : "/");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-neutral-50 dark:bg-[#08090A] text-neutral-900 dark:text-neutral-100 transition-colors duration-300 relative overflow-hidden">
      {/* Top Header Bar */}
      <header className="w-full shrink-0 border-b border-neutral-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0F1115]/80 backdrop-blur-md px-4 sm:px-6 h-16 flex items-center justify-between z-20">
        <div className="flex items-center space-x-2">
          <Link
            to={hasSession ? "/home" : "/"}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg py-1 px-1.5"
            title="NagrikPath Federated Citizen Hub"
          >
            <span className="font-bold text-xl sm:text-2xl tracking-tight text-blue-600 dark:text-blue-400">
              NagrikPath
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-2.5">
          <ThemeToggle />
          <LanguageSelector />
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center relative z-10">
        {/* Background Ambient Glow Accent */}
        <div
          className="absolute w-72 h-72 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        />

        {/* Content Card / Well */}
        <div className="bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] rounded-2xl shadow-xl p-6 sm:p-10 md:p-12 max-w-xl w-full relative z-10 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
          {/* Iconography Accent Well */}
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 p-4 rounded-2xl inline-flex mb-6 text-blue-600 dark:text-blue-400 shadow-xs">
            <Compass className="w-10 h-10 sm:w-12 sm:h-12 animate-pulse" />
          </div>

          {/* Technical Status Tag */}
          <div className="mb-4">
            <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-[#16191F] px-3 py-1 rounded-full border border-neutral-200 dark:border-white/[0.08] inline-block tracking-wider">
              ROUTE_UNRESOLVED // STATUS 404
            </span>
          </div>

          {/* Typography & Messaging */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-[#EDEDED] mb-3">
            This page could not be located.
          </h1>
          <p className="text-sm text-neutral-600 dark:text-[#8A8F98] leading-relaxed max-w-md mx-auto mb-8">
            The service route or citizen portal address you entered does not exist or may have been relocated within the federated registry.
          </p>

          {/* Citizen Recovery CTAs (Action Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mx-auto mb-4">
            <button
              onClick={handleGoHome}
              type="button"
              className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors inline-flex items-center justify-center gap-2 shadow-sm text-sm cursor-pointer"
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>Return to Citizen Hub</span>
            </button>

            <button
              onClick={() => navigate("/yojna-setu")}
              type="button"
              className="bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-[#16191F] dark:hover:bg-[#1c2027] dark:active:bg-[#252b34] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-white/[0.08] px-5 py-2.5 rounded-xl transition-colors inline-flex items-center justify-center gap-2 text-sm font-medium cursor-pointer"
            >
              <Compass className="w-4 h-4 shrink-0 text-blue-500" />
              <span>Explore Yojna Setu</span>
            </button>
          </div>

          {/* Tertiary Go Back Link */}
          <button
            onClick={handleGoBack}
            type="button"
            className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer py-1 px-2 rounded-md hover:bg-neutral-100 dark:hover:bg-white/[0.04]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go back to previous page</span>
          </button>

          {/* Quick Service Directory Links */}
          <div className="border-t border-neutral-200 dark:border-white/[0.08] mt-8 pt-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
              Quick Citizen Access
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Link
                to="/jan-manch"
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-neutral-50 dark:hover:bg-white/[0.04] border border-neutral-100 dark:border-white/[0.04] hover:border-neutral-200 dark:hover:border-white/[0.08] transition-all"
              >
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                <span>Jan Manch Tracker</span>
              </Link>

              <Link
                to="/profile"
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-neutral-50 dark:hover:bg-white/[0.04] border border-neutral-100 dark:border-white/[0.04] hover:border-neutral-200 dark:hover:border-white/[0.08] transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Family Vault</span>
              </Link>

              <Link
                to="/notifications"
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-neutral-50 dark:hover:bg-white/[0.04] border border-neutral-100 dark:border-white/[0.04] hover:border-neutral-200 dark:hover:border-white/[0.08] transition-all"
              >
                <BellRing className="w-3.5 h-3.5 text-amber-500" />
                <span>Help & Alerts</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Subtle Sovereign DPI Footer Stamp */}
      <footer className="w-full shrink-0 py-4 px-6 text-center text-xs text-neutral-400 dark:text-neutral-600 border-t border-neutral-200/50 dark:border-white/[0.04] z-10">
        <span>NagrikPath Digital Public Infrastructure (DPI) &bull; Reference Architecture 2.0</span>
      </footer>
    </div>
  );
}
