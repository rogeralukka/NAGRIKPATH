import React, { useState, useTransition } from "react";
import JanManchHeader from "../features/jan-manch/components/JanManchHeader";
import SectorSelector from "../features/jan-manch/components/SectorSelector";
import TimeRangeFilter from "../features/jan-manch/components/TimeRangeFilter";
import MetricCard from "../features/jan-manch/components/MetricCard";
import ComposedDeliveryChart from "../features/jan-manch/components/charts/ComposedDeliveryChart";
import FederalAreaTrendChart from "../features/jan-manch/components/charts/FederalAreaTrendChart";
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
 * Filter timeline based on Google-Finance-style time scrubber
 */
function filterTimeline(timeline = [], range = "ALL") {
  if (!timeline || timeline.length === 0) return [];
  if (range === "3Y") return timeline.slice(-3);
  if (range === "5Y") return timeline.slice(-5);
  return timeline;
}

/**
 * JanManchPage (/jan-manch): Empirical Governance Accountability Tracker
 * Complete Multi-Year Historical Upgrade:
 * 1. JanManchHeader with quiet Telangana State scope.
 * 2. SectorSelector with 4 strict sectors.
 * 3. TimeRangeFilter: Google-Finance-style time scrubber ([ 3Y ] [ 5Y ] [ ALL ]).
 * 4. Fixed-height balanced MetricCards with YoY % growth and utilization/fulfillment rates.
 * 5. 2-Column Responsive Recharts Grid:
 *    - ComposedDeliveryChart (Bars for Sanctioned/Disbursed + Gold Line for Rate %)
 *    - FederalAreaTrendChart (Smooth Monotone Area for Target vs Delivered)
 * 6. VarianceAnalysisCard with pure mathematical telemetry (100% backward compatible).
 * 7. Public Audit & Policy Telemetry Feed.
 */
export default function JanManchPage() {
  const [activeSectorKey, setActiveSectorKey] = useState("agriculture");
  const [timeRange, setTimeRange] = useState("ALL");
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

  // Timelines & Slicing
  const rawFinTimeline = currentSectorData.financialMetric?.timeline || [];
  const rawPhysTimeline = currentSectorData.physicalMetric?.timeline || [];

  const filteredFinTimeline = filterTimeline(rawFinTimeline, timeRange);
  const filteredPhysTimeline = filterTimeline(rawPhysTimeline, timeRange);

  // Latest Financial Telemetry for MetricCard
  const latestFin = rawFinTimeline[rawFinTimeline.length - 1] || {};
  const prevFin = rawFinTimeline[rawFinTimeline.length - 2] || latestFin;
  const finDisbursed = latestFin.stateDisbursed || 0;
  const finSanctioned = latestFin.centralSanctioned || 1;
  const finUtilizationRate = (finDisbursed / finSanctioned) * 100;
  const finYoY = prevFin.stateDisbursed
    ? ((finDisbursed - prevFin.stateDisbursed) / prevFin.stateDisbursed) * 100
    : 0;

  // Latest Physical Telemetry for MetricCard
  const latestPhys = rawPhysTimeline[rawPhysTimeline.length - 1] || {};
  const prevPhys = rawPhysTimeline[rawPhysTimeline.length - 2] || latestPhys;
  const physDelivered = latestPhys.deliveredVerified || 0;
  const physTarget = latestPhys.targetSanctioned || 1;
  const physFulfillmentRate = (physDelivered / physTarget) * 100;
  const physYoY = prevPhys.deliveredVerified
    ? ((physDelivered - prevPhys.deliveredVerified) / prevPhys.deliveredVerified) * 100
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 1. Header with Scope */}
      <JanManchHeader />

      {/* 2. STRICT SCOPE: Exactly 4 Sector Tabs */}
      <SectorSelector
        activeSector={activeSectorKey}
        onSelectSector={handleSelectSector}
      />

      {/* 3. Time Scrubber Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="text-xs font-mono text-slate-500 dark:text-[#8A8F98]">
          Historical Horizon: <span className="font-bold text-slate-800 dark:text-[#EDEDED]">{timeRange === "ALL" ? "6 Fiscal Years (FY21-FY26)" : timeRange === "5Y" ? "5 Fiscal Years (FY22-FY26)" : "3 Fiscal Years (FY24-FY26)"}</span>
        </div>
        <div className="flex justify-end">
          <TimeRangeFilter
            selectedRange={timeRange}
            onRangeChange={(range) => setTimeRange(range)}
          />
        </div>
      </div>

      {isSwitching ? (
        /* Sleek Skeleton Loading state during sector switch */
        <JanManchSkeleton />
      ) : (
        <>
          {/* 4. Multi-Year Dual-Column Visualizer Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left Column: Financial Delivery & Metric Card */}
            <div className="space-y-4">
              <MetricCard
                label={`${currentSectorData.financialMetric?.label || "Financial Outlay"} (FY26)`}
                value={`₹${finDisbursed.toLocaleString("en-IN")}`}
                unit="Cr Disbursed"
                trend={finYoY}
                rateLabel="Federal-to-State Utilization Rate"
                rateValue={finUtilizationRate}
                category="financial"
              />

              <ErrorBoundary moduleName="Financial Delivery Chart">
                <ComposedDeliveryChart
                  timeline={filteredFinTimeline}
                  metricLabel={currentSectorData.financialMetric?.label || "Financial Allocation & Disbursement"}
                  unit={currentSectorData.financialMetric?.unit || "₹ Cr"}
                />
              </ErrorBoundary>
            </div>

            {/* Right Column: Physical Ground Delivery & Metric Card */}
            <div className="space-y-4">
              <MetricCard
                label={`${currentSectorData.physicalMetric?.label || "Ground Delivery"} (FY26)`}
                value={physDelivered.toLocaleString("en-IN")}
                unit={currentSectorData.physicalMetric?.unit || "Units"}
                trend={physYoY}
                rateLabel="Ground Verification Fulfillment"
                rateValue={physFulfillmentRate}
                category="physical"
              />

              <ErrorBoundary moduleName="Physical Delivery Chart">
                <FederalAreaTrendChart
                  timeline={filteredPhysTimeline}
                  metricLabel={currentSectorData.physicalMetric?.label || "Physical Ground Delivery"}
                  unit={currentSectorData.physicalMetric?.unit || "Units"}
                />
              </ErrorBoundary>
            </div>
          </div>

          {/* 5. Empirical Variance Telemetry Card */}
          <ErrorBoundary moduleName="Variance Analysis">
            <VarianceAnalysisCard
              centralData={currentSectorData.central}
              stateData={currentSectorData.stateData}
              sectorTitle={currentSectorData.title}
            />
          </ErrorBoundary>
        </>
      )}

      {/* 6. Governance Audit Feed & Transparency Updates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-[#EDEDED] font-mono">
            Public Audit &amp; Policy Telemetry Feed
          </h2>
          <span className="text-xs font-mono text-slate-400 dark:text-[#8A8F98]">
            {currentSectorData.title}
          </span>
        </div>

        <div className="space-y-3.5">
          {(currentSectorData.auditFeed || currentSectorData.updates)?.map((upd, idx) => (
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
