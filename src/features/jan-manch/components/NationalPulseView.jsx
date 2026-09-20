import React from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Zap,
  ShieldCheck,
  DollarSign
} from "lucide-react";
import NationalPulseCard from "./NationalPulseCard";
import { useNationalPulse } from "../hooks/useNationalPulse";

/**
 * NationalPulseView:
 * Authoritative Citizen Macroeconomic & Digital Public Infrastructure Pulse Hub:
 * - 4 High-impact macro vital tiles (including synced INR Purchasing Power)
 * - 12-Card Responsive Recharts Grid with independent local scrubbers
 * - 100% Offline Client-Side Verification Fallback & Express API Sync
 */
export default function NationalPulseView() {
  const { indicators, provenance } = useNationalPulse("ALL");

  const gstInd = indicators.find((i) => i.id === "gst-collections");
  const upiInd = indicators.find((i) => i.id === "upi-volume");
  const forexInd = indicators.find((i) => i.id === "forex-reserves");

  const gstLatest = gstInd?.timeline?.[gstInd.timeline.length - 1]?.val || 212400;
  const upiLatest = upiInd?.timeline?.[upiInd.timeline.length - 1]?.val || 20.4;
  const forexLatest = forexInd?.timeline?.[forexInd.timeline.length - 1]?.val || 708;

  const macroVitals = [
    {
      id: "gst",
      title: "Gross Monthly GST",
      value: `₹${gstLatest.toLocaleString("en-IN")}`,
      unit: "Cr / mo",
      delta: "+124.1%",
      deltaLabel: "gain since FY21",
      citation: "Source: GST Council & MoF",
      icon: TrendingUp,
      isPositive: true,
      accent: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900/60"
    },
    {
      id: "upi",
      title: "UPI Monthly Volume",
      value: `${upiLatest}`,
      unit: "Billion Txns",
      delta: "+787.0%",
      deltaLabel: "gain since FY21",
      citation: "Source: NPCI Ecosystem Telemetry",
      icon: Zap,
      isPositive: true,
      accent: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900/60"
    },
    {
      id: "forex",
      title: "Foreign Exchange Reserves",
      value: `$${forexLatest}`,
      unit: "USD Bn",
      delta: "+22.3%",
      deltaLabel: "growth since FY21",
      citation: "Source: Reserve Bank of India (DBIE)",
      icon: ShieldCheck,
      isPositive: true,
      accent: "text-blue-500 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900/60"
    },
    {
      id: "inr",
      title: "INR PURCHASING POWER",
      value: "₹95.94",
      unit: "/ USD",
      subtext: "1 INR = $0.0104 USD",
      delta: "↘ -22.7%",
      deltaLabel: "6Y Depreciation",
      citation: "Source: RBI Reference / Market Benchmark",
      icon: DollarSign,
      isPositive: false, // Rupee depreciation rendered in Rose/Red
      accent: "text-rose-500 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900/60"
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 1. Top Macro Vital Bar (4 High-Impact KPI Tiles) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {macroVitals.map((vital) => {
          const Icon = vital.icon;
          return (
            <div
              key={vital.id}
              className="bg-white dark:bg-[#0F1115] p-4 rounded-xl border border-slate-200 dark:border-white/[0.08] shadow-sm flex flex-col justify-between font-mono"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-[#8A8F98] uppercase tracking-wider">
                  {vital.title}
                </span>
                <span className={`p-1 rounded-md border text-xs ${vital.accent}`}>
                  <Icon size={13} />
                </span>
              </div>

              <div className="my-2">
                <div className="text-2xl font-extrabold text-slate-900 dark:text-[#EDEDED] tracking-tight">
                  {vital.value}
                  <span className="text-xs font-normal text-slate-500 dark:text-[#8A8F98] ml-1.5 font-sans">
                    {vital.unit}
                  </span>
                </div>
                {vital.subtext && (
                  <div className="text-[10px] text-slate-400 dark:text-[#8A8F98]/80 font-mono -mt-0.5 mb-0.5">
                    {vital.subtext}
                  </div>
                )}
                <div
                  className={`flex items-center space-x-1 mt-0.5 text-[11px] font-bold ${
                    vital.isPositive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {vital.isPositive ? (
                    <ArrowUpRight size={12} className="stroke-[2.5]" />
                  ) : (
                    <ArrowDownRight size={12} className="stroke-[2.5]" />
                  )}
                  <span>{vital.delta}</span>
                  <span className="text-slate-400 dark:text-[#8A8F98] font-normal font-sans">
                    {vital.deltaLabel}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-white/[0.04] text-[10px] text-slate-400 dark:text-[#8A8F98]/70 truncate">
                {vital.citation}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Clean Citizen Header Row */}
      <div className="pt-2 border-t border-slate-200 dark:border-white/[0.08]">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-[#EDEDED] font-mono">
          MACROECONOMIC &amp; DIGITAL PUBLIC INFRASTRUCTURE MATRIX
        </h2>
        <p className="text-xs text-slate-500 dark:text-[#8A8F98] mt-0.5">
          12 empirical indicators tracking national progress • Sourced from official institutional releases
        </p>
      </div>

      {/* 3. 12-Card Responsive Recharts Grid (Independent Card Scrubbers) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        {indicators.map((indicator) => (
          <NationalPulseCard
            key={indicator.id}
            indicator={indicator}
          />
        ))}
      </div>

      {/* 4. Provenance & Compliance Footer */}
      <div className="pt-4 pb-2 border-t border-slate-200 dark:border-white/[0.08] text-center">
        <p className="text-xs font-mono text-slate-500 dark:text-[#8A8F98]">
          {provenance}
        </p>
      </div>
    </div>
  );
}
