import React, { useState, useTransition } from "react";
import JanManchHeader from "../features/jan-manch/components/JanManchHeader";
import SectorSelector from "../features/jan-manch/components/SectorSelector";
import DualAxisFinancialChart from "../features/jan-manch/components/DualAxisFinancialChart";
import DualAxisPhysicalChart from "../features/jan-manch/components/DualAxisPhysicalChart";
import VarianceAnalysisCard from "../features/jan-manch/components/VarianceAnalysisCard";
import ErrorBoundary from "../components/shared/ErrorBoundary";
import { JanManchSkeleton } from "../components/shared/skeletons";

import agricultureData from "../data/seed/janmanch/agriculture.json";
import jaljeevanData from "../data/seed/janmanch/jaljeevan.json";
import healthData from "../data/seed/janmanch/health.json";
import infrastructureData from "../data/seed/janmanch/infrastructure.json";

const SECTOR_DATA_MAP = {
  agriculture: agricultureData,
  jaljeevan: jaljeevanData,
  health: healthData,
  infrastructure: infrastructureData
};

/**
 * JanManchPage (/jan-manch): Empirical Governance Accountability Tracker
 * Complete Phase 5 Implementation:
 * 1. JanManchHeader with verbatim "[Data View: PoC Seeded Cache]" badge and scope pill.
 * 2. SectorSelector with 4 strict sectors.
 * 3. 2-Column Responsive Recharts Grid (DualAxisFinancialChart + DualAxisPhysicalChart)
 *    with responsive container guard "h-72 min-h-[288px] w-full min-w-0" and isAnimationActive={false}.
 * 4. Resilient Error Boundary wrappers on every chart widget.
 * 5. Sleek Skeleton Loaders during sector switching with zero CLS.
 * 6. VarianceAnalysisCard with pure mathematical telemetry.
 * 7. Governance updates & audit feed from seeded data.
 */
export default function JanManchPage() {
  const [activeSectorKey, setActiveSectorKey] = useState("agriculture");
  const [isPending, startTransition] = useTransition();
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSelectSector = (sectorKey) => {
    if (sectorKey === activeSectorKey) return;
    setIsSwitching(true);
    startTransition(() => {
      setActiveSectorKey(sectorKey);
      setTimeout(() => {
        setIsSwitching(false);
      }, 150);
    });
  };

  const currentSectorData = SECTOR_DATA_MAP[activeSectorKey] || SECTOR_DATA_MAP.agriculture;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 1. Header with Scope & Cache Badges */}
      <JanManchHeader />

      {/* 2. STRICT SCOPE: Exactly 4 Sector Tabs */}
      <SectorSelector
        activeSector={activeSectorKey}
        onSelectSector={handleSelectSector}
      />

      {isSwitching ? (
        /* Sleek Skeleton Loading state during sector switch */
        <JanManchSkeleton />
      ) : (
        <>
          {/* 3. Dual-Axis Recharts Delivery Dashboard (Financial vs Physical Verified) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ErrorBoundary moduleName="Financial Delivery Chart">
              <DualAxisFinancialChart
                centralData={currentSectorData.central}
                stateData={currentSectorData.stateData}
                sectorTitle={currentSectorData.title}
              />
            </ErrorBoundary>

            <ErrorBoundary moduleName="Physical Delivery Chart">
              <DualAxisPhysicalChart
                centralData={currentSectorData.central}
                stateData={currentSectorData.stateData}
              />
            </ErrorBoundary>
          </div>

          {/* 4. Empirical Variance Telemetry Card */}
          <ErrorBoundary moduleName="Variance Analysis">
            <VarianceAnalysisCard
              centralData={currentSectorData.central}
              stateData={currentSectorData.stateData}
              sectorTitle={currentSectorData.title}
            />
          </ErrorBoundary>
        </>
      )}

      {/* 5. Governance Audit Feed & Transparency Updates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-[#EDEDED] font-mono">
            Public Audit & Policy Telemetry Feed
          </h2>
          <span className="text-xs font-mono text-slate-400 dark:text-[#8A8F98]">
            {currentSectorData.title}
          </span>
        </div>

        <div className="space-y-3.5">
          {currentSectorData.updates?.map((upd, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#0F1115] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-2.5 transition-all hover:border-slate-300 dark:hover:border-white/20"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`text-[10px] font-bold font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      upd.type === "Policy Change"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                        : upd.type === "Budget Allocation"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                    }`}
                  >
                    {upd.type}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-[#EDEDED]">
                    {upd.title}
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-[#8A8F98]/70 font-mono">
                  {upd.date}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-[#8A8F98] leading-relaxed">
                {upd.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
