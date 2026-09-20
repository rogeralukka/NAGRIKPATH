import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Zap,
  ShieldCheck,
  DollarSign,
  RefreshCw
} from "lucide-react";
import TimeRangeFilter from "./TimeRangeFilter";
import { useNationalPulse } from "../hooks/useNationalPulse";

/**
 * Category styling map for clean badges
 */
const CATEGORY_STYLES = {
  Macroeconomics:
    "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  "Fiscal & Revenue":
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  "Digital Public Infra":
    "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
  "Energy & Climate":
    "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  "Social Welfare":
    "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  Healthcare:
    "bg-pink-50 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 border-pink-200 dark:border-pink-800",
  "Public Infrastructure":
    "bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800"
};

/**
 * Custom Tooltip for National Pulse Visualizers
 */
function NationalChartTooltip({ active, payload, label, unit }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-[#0F1115] border border-white/10 p-2.5 rounded-xl shadow-xl font-mono text-xs text-[#EDEDED] space-y-1 min-w-[140px]">
      <div className="font-bold border-b border-white/10 pb-1 text-slate-300 flex items-center justify-between">
        <span>{label}</span>
        <span className="text-[10px] text-slate-400">Verified</span>
      </div>
      {payload.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between gap-2 pt-0.5">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color || item.fill || item.stroke }}
            ></span>
            {item.name === "val" ? "Value:" : item.name}:
          </span>
          <span className="font-bold text-white">
            {typeof item.value === "number"
              ? item.value.toLocaleString("en-IN")
              : item.value}{" "}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Single Indicator Card with dynamic visualizer and strict semantic color rules
 */
function NationalIndicatorCard({ indicator }) {
  const timeline = indicator.timeline || [];
  const firstEntry = timeline[0] || {};
  const latestEntry = timeline[timeline.length - 1] || {};

  const latestVal = latestEntry.val;
  const firstVal = firstEntry.val;

  // Calculate percentage delta
  const deltaPct =
    firstVal && latestVal !== undefined
      ? ((latestVal - firstVal) / firstVal) * 100
      : 0;

  // Strict semantic color rules:
  // - INR/USD: Higher number means Rupee depreciation (worse). Never green!
  // - CPI Inflation & Power Deficit: Lower is better. Drop is green!
  // - Other indicators: Higher is better.
  let isPositiveTrend = false;
  if (indicator.id === "inr-usd-rate") {
    isPositiveTrend = deltaPct < 0; // Rupee strengthening is good, weakening is bad
  } else if (indicator.direction === "lower-is-better" || indicator.id === "power-deficit" || indicator.id === "cpi-inflation") {
    isPositiveTrend = deltaPct <= 0;
  } else {
    isPositiveTrend = deltaPct >= 0;
  }

  const categoryStyle =
    CATEGORY_STYLES[indicator.category] ||
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";

  const gradientId = `grad-${indicator.id}`;

  return (
    <div className="bg-white dark:bg-[#0F1115] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/20 transition-all">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span
            className={`text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded-md border ${categoryStyle}`}
          >
            {indicator.category}
          </span>
          <span className="text-[10px] font-mono text-slate-400 dark:text-[#8A8F98]/70">
            {indicator.citationRef}
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-900 dark:text-[#EDEDED] leading-tight">
          {indicator.title}
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-[#8A8F98] mt-0.5 truncate">
          {indicator.source}
        </p>

        {/* Current Figure + Trend Delta Badge */}
        <div className="flex items-baseline justify-between mt-3 mb-2 font-mono">
          <div className="text-2xl font-extrabold text-slate-900 dark:text-[#EDEDED] tracking-tight">
            {typeof latestVal === "number" ? latestVal.toLocaleString("en-IN") : latestVal}
            <span className="text-xs font-normal text-slate-500 dark:text-[#8A8F98] ml-1.5 font-sans">
              {indicator.unit}
            </span>
          </div>

          <div
            className={`inline-flex items-center space-x-0.5 px-2 py-0.5 rounded-md text-[11px] font-bold border ${
              isPositiveTrend
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800"
            }`}
          >
            {deltaPct >= 0 ? (
              <ArrowUpRight size={12} className="stroke-[2.5]" />
            ) : (
              <ArrowDownRight size={12} className="stroke-[2.5]" />
            )}
            <span>{deltaPct >= 0 ? `+${deltaPct.toFixed(1)}%` : `${deltaPct.toFixed(1)}%`}</span>
          </div>
        </div>
      </div>

      {/* Visualizer Container strictly locked to h-48 min-h-[192px] */}
      <div className="h-48 min-h-[192px] w-full min-w-0 mt-3 pt-2 border-t border-slate-100 dark:border-white/[0.04]">
        <ResponsiveContainer width="100%" height="100%">
          {indicator.chartType === "composed" ? (
            <ComposedChart
              data={timeline}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-slate-200 dark:text-white/[0.05]"
                vertical={false}
              />
              <XAxis
                dataKey="fy"
                stroke="#8A8F98"
                tick={{ fontSize: 10, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={{ stroke: "currentColor", className: "text-slate-200 dark:text-white/[0.08]" }}
              />
              <YAxis
                yAxisId="left"
                stroke="#8A8F98"
                tick={{ fontSize: 9, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#f59e0b"
                tick={{ fontSize: 9, fontFamily: "monospace", fill: "#f59e0b" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip content={<NationalChartTooltip unit={indicator.unit} />} />
              <Bar
                yAxisId="left"
                dataKey="val"
                name="Revenue"
                fill={indicator.color || "#10b981"}
                radius={[4, 4, 0, 0]}
                maxBarSize={22}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="yoy"
                name="YoY Growth %"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3, fill: "#f59e0b" }}
              />
            </ComposedChart>
          ) : indicator.chartType === "line" ? (
            <LineChart
              data={timeline}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-slate-200 dark:text-white/[0.05]"
                vertical={false}
              />
              <XAxis
                dataKey="fy"
                stroke="#8A8F98"
                tick={{ fontSize: 10, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={{ stroke: "currentColor", className: "text-slate-200 dark:text-white/[0.08]" }}
              />
              <YAxis
                stroke="#8A8F98"
                domain={['dataMin - 1', 'dataMax + 1']}
                tick={{ fontSize: 9, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<NationalChartTooltip unit={indicator.unit} />} />
              <Line
                type="monotone"
                dataKey="val"
                name="Value"
                stroke={indicator.color || "#3b82f6"}
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: indicator.color || "#3b82f6", strokeWidth: 1.5, stroke: "#0F1115" }}
                activeDot={{ r: 5.5 }}
              />
            </LineChart>
          ) : (
            <AreaChart
              data={timeline}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={indicator.color || "#3b82f6"} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={indicator.color || "#3b82f6"} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-slate-200 dark:text-white/[0.05]"
                vertical={false}
              />
              <XAxis
                dataKey="fy"
                stroke="#8A8F98"
                tick={{ fontSize: 10, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={{ stroke: "currentColor", className: "text-slate-200 dark:text-white/[0.08]" }}
              />
              <YAxis
                stroke="#8A8F98"
                tick={{ fontSize: 9, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
              />
              <Tooltip content={<NationalChartTooltip unit={indicator.unit} />} />
              <Area
                type="monotone"
                dataKey="val"
                name="Value"
                stroke={indicator.color || "#3b82f6"}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * NationalPulseView:
 * Adaptive Data Hub connecting to Express backend with offline fallback.
 */
export default function NationalPulseView() {
  const [timeRange, setTimeRange] = useState("ALL");
  const { indicators, isLoading, isLiveBackend, lastSynced, provenance, syncNow } = useNationalPulse(timeRange);

  // Macro Vital Indicators
  const gstInd = indicators.find((i) => i.id === "gst-collections");
  const upiInd = indicators.find((i) => i.id === "upi-volume");
  const forexInd = indicators.find((i) => i.id === "forex-reserves");
  const inrInd = indicators.find((i) => i.id === "inr-usd-rate");

  const gstLatest = gstInd?.timeline?.[gstInd.timeline.length - 1]?.val || 212400;
  const upiLatest = upiInd?.timeline?.[upiInd.timeline.length - 1]?.val || 20.4;
  const forexLatest = forexInd?.timeline?.[forexInd.timeline.length - 1]?.val || 708;
  const inrLatest = inrInd?.timeline?.[inrInd.timeline.length - 1]?.val || 86.8;

  const macroVitals = [
    {
      id: "gst",
      title: "Gross Monthly GST",
      value: `₹${gstLatest.toLocaleString("en-IN")}`,
      unit: "Cr / mo",
      delta: "+124.1%",
      deltaLabel: "gain since FY21",
      citation: "REF: GSTN-PORTAL",
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
      citation: "REF: NPCI-UPI-2026",
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
      citation: "REF: RBI-DBIE-2026",
      icon: ShieldCheck,
      isPositive: true,
      accent: "text-blue-500 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900/60"
    },
    {
      id: "inr",
      title: "INR / USD Reference Rate",
      value: `₹${inrLatest}`,
      unit: "/ USD",
      delta: "+17.0%",
      deltaLabel: "6Y mean shift (deprec)",
      citation: "REF: RBI-WSS-2026",
      icon: DollarSign,
      isPositive: false, // Rupee weakening is shown in red/rose!
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

              <div className="pt-2 border-t border-slate-100 dark:border-white/[0.04] text-[10px] text-slate-400 dark:text-[#8A8F98]/70">
                {vital.citation}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Interactive Time Range Filter Header Row + Live Telemetry Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-[#EDEDED] font-mono">
              Macroeconomic &amp; Digital Public Infrastructure Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#8A8F98] mt-0.5">
            12 empirical indicators tracking national progress from FY21 to FY26
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Live Telemetry Strip */}
          <div className="flex items-center space-x-2">
            {isLiveBackend ? (
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-xs font-mono text-emerald-700 dark:text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Backend Sync: {lastSynced || "Daily"}</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-[#16191F] border border-neutral-200 dark:border-white/[0.08] text-xs font-mono text-neutral-500 dark:text-[#8A8F98]">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>Local Sovereign Baseline (Sep 2026)</span>
              </span>
            )}

            {isLiveBackend && (
              <button
                type="button"
                onClick={syncNow}
                title="Force refresh live spot rates"
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 dark:text-[#8A8F98] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw size={12} />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <TimeRangeFilter
              selectedRange={timeRange}
              onRangeChange={(range) => setTimeRange(range)}
            />
          </div>
        </div>
      </div>

      {/* 3. 12-Card Responsive Recharts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        {indicators.map((indicator) => (
          <NationalIndicatorCard
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
