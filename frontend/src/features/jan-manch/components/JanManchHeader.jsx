import React from "react";

/**
 * JanManchHeader:
 * Title: "JAN MANCH"
 * Subtitle: "Empirical Governance Accountability Tracker"
 * Scope Pill: "SCOPE: TELANGANA STATE // CENTRAL ALLOCATION"
 */
export default function JanManchHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-[#EDEDED]">
          JAN MANCH
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8A8F98] mt-1 font-medium">
          Empirical Governance Accountability Tracker
        </p>
      </div>

      <div>
        {/* Scope Pill */}
        <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#16191F] border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-[#EDEDED]">
          SCOPE: <span className="font-bold text-blue-600 dark:text-blue-400">TELANGANA STATE</span> // <span className="text-slate-500 dark:text-[#8A8F98]">CENTRAL ALLOCATION</span>
        </div>
      </div>
    </div>
  );
}
