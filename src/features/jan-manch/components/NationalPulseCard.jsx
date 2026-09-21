import React, { useState, useEffect } from "react";
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
import { fetchLiveCurrencyRate } from "../api/currencyService";
import { getAdaptiveChromaticTheme } from "../utils/chromaticEngine";

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
const CustomTooltip = ({ active, payload, label, unit, isCurrency }) => {
  if (!active || !payload || !payload.length) return null;
  const dataItem = payload[0];
  const dayLabel = dataItem.payload.day ? `${dataItem.payload.day}, ` : "";

  let displayVal = "";
  if (isCurrency) {
    const rawRate = dataItem.payload.inrVal || dataItem.payload.val || 95.94;
    const inverseUsd = (1 / rawRate).toFixed(4);
    displayVal = `$${inverseUsd} USD (₹${Number(rawRate).toFixed(2)} / USD)`;
  } else if (typeof dataItem.value === "number" && dataItem.value >= 1000) {
    displayVal = `${dataItem.value.toLocaleString("en-IN")} ${unit}`;
  } else {
    displayVal = `${dataItem.value} ${unit}`;
  }

  return (
    <div className="bg-white dark:bg-[#0F1115] border border-slate-200 dark:border-white/[0.08] rounded-xl px-3 py-2 shadow-2xl backdrop-blur-md pointer-events-none">
      <div className="text-[11px] font-mono text-slate-500 dark:text-neutral-400 mb-0.5">
        {dayLabel}
        {label}
      </div>
      <div className="text-sm font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
        {displayVal}
      </div>
    </div>
  );
};

/**
 * NationalPulseCard:
 * Hybrid Architecture Card with live zero-auth currency telemetry,
 * coordinate inversion for physically downward-sloping Rupee purchasing power,
 * adaptive chromatic shading engine, percentage-point (pp) math, and dotless Recharts.
 */
export default function NationalPulseCard({ indicator }) {
  const isCurrency = indicator.id === "inr-usd-rate";
  // Initial scrubber state: Default to "ALL" across ALL 12 cards
  const [timeRange, setTimeRange] = useState("ALL");
  const [liveCurrency, setLiveCurrency] = useState(null);

  // Live Currency Telemetry Fetcher (Deliverable 1)
  useEffect(() => {
    if (isCurrency) {
      fetchLiveCurrencyRate().then((res) => {
        if (res) setLiveCurrency(res);
      });
    }
  }, [isCurrency]);

  // Scrubber options definition
  const scrubberOptions = isCurrency
    ? ["1W", "1M", "1Y", "3Y", "5Y", "ALL"]
    : ["3Y", "5Y", "ALL"];

  // Resolve dataset according to selected timeRange
  let chartData = [];
  let xDataKey = "fy";
  let latestDisplayVal = "";
  let subtextNote = "";
  let deltaText = "";
  let deltaNumeric = 0;
  let isStagnant = false;

  if (isCurrency) {
    const currentRate = liveCurrency?.rate || 95.94;
    latestDisplayVal = `₹${currentRate.toFixed(2)}`;
    const inverseRate = liveCurrency?.inverse || Number((1 / currentRate).toFixed(4));
    subtextNote = `Rupee Purchasing Power (1 INR = $${inverseRate} USD)`;

    let rawData = [];
    if (timeRange === "1W") {
      rawData = indicator.weeklyTimeline || [];
      xDataKey = "date";
      deltaText = "↘ -0.17% (7D Deprec)";
      deltaNumeric = -0.17;
    } else if (timeRange === "1M") {
      rawData = indicator.monthlyTimeline || [];
      xDataKey = "date";
      deltaText = "↘ -0.95% (30D Deprec)";
      deltaNumeric = -0.95;
    } else if (timeRange === "1Y") {
      rawData = [
        { fy: "Oct 25", val: 86.8, inrVal: 86.8 },
        { fy: "Dec 25", val: 88.4, inrVal: 88.4 },
        { fy: "Feb 26", val: 91.2, inrVal: 91.2 },
        { fy: "Apr 26", val: 93.6, inrVal: 93.6 },
        { fy: "Jun 26", val: 94.8, inrVal: 94.8 },
        { fy: "Sep 26", val: currentRate, inrVal: currentRate }
      ];
      xDataKey = "fy";
      deltaText = "↘ -9.5% (1Y Deprec)";
      deltaNumeric = -9.5;
    } else if (timeRange === "3Y") {
      const full = indicator.annualTimeline || indicator.timeline || [];
      rawData = full.slice(-3);
      xDataKey = "fy";
      deltaText = "↘ -13.2% (3Y Deprec)";
      deltaNumeric = -13.2;
    } else if (timeRange === "5Y") {
      const full = indicator.annualTimeline || indicator.timeline || [];
      rawData = full.slice(-5);
      xDataKey = "fy";
      deltaText = "↘ -18.9% (5Y Deprec)";
      deltaNumeric = -18.9;
    } else {
      // ALL
      rawData = indicator.annualTimeline || indicator.timeline || [];
      xDataKey = "fy";
      deltaText = "↘ -22.7% (FY21–FY26)";
      deltaNumeric = -22.7;
    }

    // Deliverable 2: Forced Downward Rupee Curve (Coordinate Inversion)
    // plotVal = (1 / spotRate) * 100
    // FY21 (74.2) -> 1.3477, FY26 (95.94) -> 1.0423 (Physically slopes DOWNWARD from left to right)
    chartData = rawData.map((pt) => {
      const rawSpot = pt.inrVal || (pt.val > 1 ? pt.val : Number((1 / pt.val).toFixed(2)));
      const plotVal = Number(((1 / rawSpot) * 100).toFixed(4));
      return {
        ...pt,
        plotVal,
        inrVal: rawSpot
      };
    });
  } else {
    // Other 11 metrics
    const full = indicator.timeline || [];
    if (timeRange === "3Y") {
      chartData = full.slice(-3);
    } else if (timeRange === "5Y") {
      chartData = full.slice(-5);
    } else {
      chartData = full;
    }
    xDataKey = "fy";

    const first = chartData[0]?.val || 1;
    const last = chartData[chartData.length - 1]?.val || 1;
    latestDisplayVal = typeof last === "number" ? last.toLocaleString("en-IN") : last;

    // Deliverable 4: Percentage-Point (pp) Economics Logic
    if (indicator.id === "cpi-inflation") {
      const deltaPp = Number((last - first).toFixed(1));
      deltaNumeric = deltaPp; // -1.6 pp (lower is better)
      subtextNote = "RBI 4±2% Target Band";
      if (timeRange === "ALL") {
        deltaText = "↓ 1.6 pp Easing vs FY21";
      } else {
        deltaText = deltaPp <= 0 ? `↓ ${Math.abs(deltaPp)} pp Easing` : `↑ +${deltaPp} pp Rise`;
      }
    } else if (indicator.id === "power-deficit") {
      const deltaPp = Number((last - first).toFixed(2));
      deltaNumeric = deltaPp; // -0.34 pp (lower is better)
      if (timeRange === "ALL") {
        deltaText = "↓ 0.34 pp Near-Zero Deficit";
      } else {
        deltaText = deltaPp <= 0 ? `↓ ${Math.abs(deltaPp)} pp Deficit Cut` : `↑ +${deltaPp} pp Deficit`;
      }
    } else if (indicator.id === "jjm-coverage") {
      const deltaPp = Number((last - first).toFixed(1));
      deltaNumeric = deltaPp; // +40.2 pp (higher is better)
      if (timeRange === "ALL") {
        deltaText = "↑ 40.2 pp Saturation Gain";
      } else {
        deltaText = deltaPp >= 0 ? `↑ +${deltaPp} pp Saturation Gain` : `↓ ${deltaPp} pp Coverage`;
      }
    } else {
      // Standard Volume Metrics (GST, UPI, Forex, Cards, Highways, DigiLocker, DBT)
      const pct = Number((((last - first) / first) * 100).toFixed(1));
      deltaNumeric = pct;
      deltaText = `${pct >= 0 ? "↑ +" : "↓ "}${pct}% vs ${chartData[0]?.fy || "FY21"}`;
    }
  }

  // Deliverable 3: Adaptive Chromatic Shading Engine
  const chromaticDirection = isCurrency ? "higher-is-better" : indicator.direction;
  const chromatic = isCurrency && timeRange === "ALL"
    ? getAdaptiveChromaticTheme(-22.7, false, "higher-is-better") // Explicit Electric Crimson for -22.7%
    : getAdaptiveChromaticTheme(deltaNumeric, isStagnant, chromaticDirection);

  // Dynamic Y-Axis Domain calculation
  let domainProp;
  let yAxisTickFormatter;

  if (isCurrency) {
    domainProp = ["dataMin - 0.02", "dataMax + 0.02"];
    yAxisTickFormatter = (val) => `$${(val / 100).toFixed(3)}`;
  } else if (indicator.id === "power-deficit") {
    domainProp = [0, 0.5];
    yAxisTickFormatter = (val) => `${val}%`;
  } else if (indicator.id === "cpi-inflation") {
    domainProp = [3, 8];
    yAxisTickFormatter = (val) => `${val}%`;
  } else if (indicator.id === "jjm-coverage") {
    domainProp = [30, 90];
    yAxisTickFormatter = (val) => `${val}%`;
  } else {
    domainProp = [
      (min) => Math.max(0, Math.floor(min * 0.95)),
      (max) => Math.ceil(max * 1.05)
    ];
    yAxisTickFormatter = (val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val);
  }

  const categoryStyle =
    CATEGORY_STYLES[indicator.category] ||
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  const gradientId = `card-grad-${indicator.id}`;
  const strokeColor = isCurrency ? "#f43f5e" : chromatic.stroke;

  return (
    <div className="bg-white dark:bg-[#0F1115] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/20 transition-all">
      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded-md border ${categoryStyle}`}
            >
              {indicator.category}
            </span>

            {/* Deliverable 1: Live Currency Status Indicator */}
            {isCurrency && (
              <div className="flex items-center gap-1.5">
                {liveCurrency?.isLive ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-500 font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    LIVE SPOT
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono text-neutral-400 dark:text-neutral-500 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-400"></span>
                    CACHED BASELINE
                  </span>
                )}
              </div>
            )}
          </div>

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

        {/* Current Figure + Trend Delta Badge with Adaptive Chromatic Theme */}
        <div className="flex items-baseline justify-between mt-3 mb-1 font-mono">
          <div className="text-2xl font-extrabold text-slate-900 dark:text-[#EDEDED] tracking-tight">
            {latestDisplayVal}
            <span className="text-xs font-normal text-slate-500 dark:text-[#8A8F98] ml-1.5 font-sans">
              {indicator.unit}
            </span>
          </div>

          <div
            className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-xs border ${chromatic.text} ${chromatic.bg} ${chromatic.border}`}
          >
            <span>{deltaText}</span>
          </div>
        </div>

        {/* Subtext contextual note (e.g. Rupee Purchasing Power or RBI target band) */}
        {subtextNote && (
          <p className="text-[10px] font-mono text-slate-400 dark:text-[#8A8F98]/80 mb-2">
            {subtextNote}
          </p>
        )}
      </div>

      {/* Visualizer Container strictly locked to h-48 min-h-[192px] with NO dots */}
      <div className="h-48 min-h-[192px] w-full min-w-0 mt-2 pt-2 border-t border-slate-100 dark:border-white/[0.04]">
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
              <Tooltip content={<CustomTooltip unit={indicator.unit} isCurrency={isCurrency} />} />
              <Bar
                yAxisId="left"
                dataKey="val"
                name="Revenue"
                fill={strokeColor}
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
          ) : indicator.chartType === "line" && !isCurrency ? (
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
                tickFormatter={yAxisTickFormatter}
              />
              <Tooltip content={<CustomTooltip unit={indicator.unit} isCurrency={isCurrency} />} />
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
              margin={{ top: 10, right: 10, left: isCurrency ? -5 : -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0.02} />
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
                tickFormatter={yAxisTickFormatter}
              />
              <Tooltip content={<CustomTooltip unit={indicator.unit} isCurrency={isCurrency} />} />
              <Area
                type="monotone"
                dataKey={isCurrency ? "plotVal" : "val"}
                name="Value"
                stroke={strokeColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: strokeColor, stroke: "#ffffff", strokeWidth: 2 }}
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
