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
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

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
 * Clean Minimalist Obsidian Tooltip (No "Verified" badge, No colored bullet)
 */
const CustomTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload || !payload.length) return null;
  const dataItem = payload[0];
  const dayLabel = dataItem.payload.day ? `${dataItem.payload.day}, ` : "";

  return (
    <div className="bg-[#0F1115] border border-white/[0.08] rounded-xl px-3 py-2 shadow-2xl backdrop-blur-md pointer-events-none">
      <div className="text-[11px] font-mono text-neutral-400 mb-0.5">
        {dayLabel}
        {label}
      </div>
      <div className="text-sm font-bold text-white tabular-nums tracking-tight">
        {typeof dataItem.value === "number" && dataItem.value > 1000
          ? dataItem.value.toLocaleString("en-IN")
          : dataItem.value}{" "}
        <span className="text-xs font-normal text-neutral-400">{unit}</span>
      </div>
    </div>
  );
};

/**
 * NationalPulseCard:
 * Independent card component with local time scrubber, dynamic slicing,
 * and strict semantic color inverted logic.
 */
export default function NationalPulseCard({ indicator }) {
  const isCurrency = indicator.id === "inr-usd-rate";
  const [timeRange, setTimeRange] = useState(isCurrency ? "1W" : "ALL");

  // Scrubber options definition
  const scrubberOptions = isCurrency
    ? ["1W", "1M", "1Y", "3Y", "5Y", "ALL"]
    : ["1Y", "3Y", "5Y", "ALL"];

  // Resolve dataset according to selected timeRange
  let chartData = [];
  let xDataKey = "fy";
  let latestDisplayVal = indicator.currentHeadline || "";
  let deltaText = "";
  let isPositive = false;

  if (isCurrency) {
    if (timeRange === "1W") {
      chartData = indicator.weeklyTimeline || [];
      xDataKey = "date";
      const first = chartData[0]?.val || 95.78;
      const last = chartData[chartData.length - 1]?.val || 95.94;
      const d = ((last - first) / first) * 100;
      deltaText = `↗ +${d.toFixed(2)}% (7D Deprec)`;
      latestDisplayVal = `₹${last.toFixed(2)}`;
      isPositive = false; // Rupee weakening is rose/red
    } else if (timeRange === "1M") {
      chartData = indicator.monthlyTimeline || [];
      xDataKey = "date";
      const first = chartData[0]?.val || 95.82;
      const last = chartData[chartData.length - 1]?.val || 95.94;
      const d = ((last - first) / first) * 100;
      deltaText = `↗ +${d.toFixed(2)}% (30D Deprec)`;
      latestDisplayVal = `₹${last.toFixed(2)}`;
      isPositive = false;
    } else if (timeRange === "1Y") {
      chartData = [
        { fy: "Oct 25", val: 86.8 },
        { fy: "Dec 25", val: 88.4 },
        { fy: "Feb 26", val: 91.2 },
        { fy: "Apr 26", val: 93.6 },
        { fy: "Jun 26", val: 94.8 },
        { fy: "Sep 26", val: 95.94 }
      ];
      xDataKey = "fy";
      deltaText = "↗ +10.5% (1Y Deprec)";
      latestDisplayVal = "₹95.94";
      isPositive = false;
    } else if (timeRange === "3Y") {
      const full = indicator.annualTimeline || indicator.timeline || [];
      chartData = full.slice(-3);
      xDataKey = "fy";
      const first = chartData[0]?.val || 83.3;
      const last = chartData[chartData.length - 1]?.val || 95.94;
      const d = ((last - first) / first) * 100;
      deltaText = `↗ +${d.toFixed(1)}% (3Y Deprec)`;
      latestDisplayVal = `₹${last}`;
      isPositive = false;
    } else if (timeRange === "5Y") {
      const full = indicator.annualTimeline || indicator.timeline || [];
      chartData = full.slice(-5);
      xDataKey = "fy";
      const first = chartData[0]?.val || 77.8;
      const last = chartData[chartData.length - 1]?.val || 95.94;
      const d = ((last - first) / first) * 100;
      deltaText = `↗ +${d.toFixed(1)}% (5Y Deprec)`;
      latestDisplayVal = `₹${last}`;
      isPositive = false;
    } else {
      // ALL
      chartData = indicator.annualTimeline || indicator.timeline || [];
      xDataKey = "fy";
      const first = chartData[0]?.val || 74.2;
      const last = chartData[chartData.length - 1]?.val || 95.94;
      const d = ((last - first) / first) * 100;
      deltaText = `↗ +${d.toFixed(1)}% Rupee Depreciation`;
      latestDisplayVal = `₹${last}`;
      isPositive = false;
    }
  } else {
    // Other 11 metrics
    const full = indicator.timeline || [];
    if (timeRange === "1Y") {
      chartData = full.slice(-2);
    } else if (timeRange === "3Y") {
      chartData = full.slice(-3);
    } else if (timeRange === "5Y") {
      chartData = full.slice(-5);
    } else {
      chartData = full;
    }
    xDataKey = "fy";

    const first = chartData[0]?.val || 1;
    const last = chartData[chartData.length - 1]?.val || 1;
    const d = ((last - first) / first) * 100;

    latestDisplayVal = typeof last === "number" ? last.toLocaleString("en-IN") : last;
    const isInverse =
      indicator.id === "power-deficit" ||
      indicator.id === "cpi-inflation" ||
      indicator.direction === "lower-is-better";

    if (isInverse) {
      isPositive = d <= 0; // reduction is emerald
      deltaText = d >= 0 ? `+${d.toFixed(1)}%` : `${d.toFixed(1)}%`;
    } else {
      isPositive = d >= 0; // increase is emerald
      deltaText = d >= 0 ? `+${d.toFixed(1)}%` : `${d.toFixed(1)}%`;
    }
  }

  // Dynamic Y-Axis Domain calculation
  let domainProp = ["dataMin - 1", "dataMax + 1"];
  if (isCurrency && (timeRange === "1W" || timeRange === "1M")) {
    domainProp = [
      (dataMin) => Number((dataMin - 0.15).toFixed(2)),
      (dataMax) => Number((dataMax + 0.15).toFixed(2))
    ];
  } else if (indicator.id === "power-deficit") {
    domainProp = [0, 0.5];
  } else if (indicator.id === "cpi-inflation") {
    domainProp = [3, 8];
  } else if (indicator.id === "jjm-coverage") {
    domainProp = [30, 90];
  } else {
    domainProp = [
      (min) => Math.max(0, Math.floor(min * 0.95)),
      (max) => Math.ceil(max * 1.05)
    ];
  }

  const categoryStyle =
    CATEGORY_STYLES[indicator.category] ||
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  const gradientId = `card-grad-${indicator.id}`;
  const strokeColor = isCurrency ? "#f43f5e" : indicator.color || "#3b82f6";

  return (
    <div className="bg-white dark:bg-[#0F1115] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/20 transition-all">
      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span
            className={`text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded-md border ${categoryStyle}`}
          >
            {indicator.category}
          </span>

          {/* Independent Time Range Scrubber */}
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-white/[0.04] p-0.5 rounded-lg border border-neutral-200/60 dark:border-white/[0.06]">
            {scrubberOptions.map((opt) => {
              const isActive = timeRange === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setTimeRange(opt)}
                  className={`cursor-pointer ${
                    isActive
                      ? "bg-white dark:bg-[#16191F] text-neutral-900 dark:text-white font-semibold shadow-xs text-[10px] px-2 py-0.5 rounded-md transition-all"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white text-[10px] px-2 py-0.5 rounded-md transition-all"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#EDEDED] leading-tight">
            {indicator.title}
          </h3>
          <span className="text-[10px] font-mono text-slate-400 dark:text-[#8A8F98]/70">
            {indicator.citationRef}
          </span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-[#8A8F98] mt-0.5 truncate">
          {indicator.source}
        </p>

        {/* Current Figure + Trend Delta Badge */}
        <div className="flex items-baseline justify-between mt-3 mb-2 font-mono">
          <div className="text-2xl font-extrabold text-slate-900 dark:text-[#EDEDED] tracking-tight">
            {latestDisplayVal}
            <span className="text-xs font-normal text-slate-500 dark:text-[#8A8F98] ml-1.5 font-sans">
              {indicator.unit}
            </span>
          </div>

          <div
            className={`inline-flex items-center space-x-0.5 px-2 py-0.5 rounded-md text-xs font-medium border ${
              isPositive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                : "bg-rose-50 text-rose-600 dark:text-rose-400 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20"
            }`}
          >
            <span>{deltaText}</span>
          </div>
        </div>
      </div>

      {/* Visualizer Container strictly locked to h-48 min-h-[192px] with NO dots */}
      <div className="h-48 min-h-[192px] w-full min-w-0 mt-3 pt-2 border-t border-slate-100 dark:border-white/[0.04]">
        <ResponsiveContainer width="100%" height="100%">
          {indicator.chartType === "composed" ? (
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-slate-200 dark:text-white/[0.05]"
                vertical={false}
              />
              <XAxis
                dataKey={xDataKey}
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
              <Tooltip content={<CustomTooltip unit={indicator.unit} />} />
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
                dot={false}
                activeDot={{ r: 4, fill: "#f59e0b", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </ComposedChart>
          ) : indicator.chartType === "line" ? (
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-slate-200 dark:text-white/[0.05]"
                vertical={false}
              />
              <XAxis
                dataKey={xDataKey}
                stroke="#8A8F98"
                tick={{ fontSize: 10, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={{ stroke: "currentColor", className: "text-slate-200 dark:text-white/[0.08]" }}
              />
              <YAxis
                stroke="#8A8F98"
                domain={domainProp}
                tick={{ fontSize: 9, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip unit={indicator.unit} />} />
              <Line
                type="monotone"
                dataKey="val"
                name="Value"
                stroke={strokeColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: strokeColor, stroke: "#ffffff", strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <AreaChart
              data={chartData}
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
                dataKey={xDataKey}
                stroke="#8A8F98"
                tick={{ fontSize: 10, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={{ stroke: "currentColor", className: "text-slate-200 dark:text-white/[0.08]" }}
              />
              <YAxis
                stroke="#8A8F98"
                domain={domainProp}
                tick={{ fontSize: 9, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
              />
              <Tooltip content={<CustomTooltip unit={indicator.unit} />} />
              <Area
                type="monotone"
                dataKey="val"
                name="Value"
                stroke={indicator.color || "#3b82f6"}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: indicator.color || "#3b82f6", stroke: "#ffffff", strokeWidth: 2 }}
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
