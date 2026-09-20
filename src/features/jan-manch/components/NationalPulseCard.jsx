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
    const usdVal = typeof dataItem.value === "number" ? dataItem.value.toFixed(5) : dataItem.value;
    const inrVal = dataItem.payload.inrVal
      ? dataItem.payload.inrVal.toFixed(2)
      : (1 / dataItem.value).toFixed(2);
    displayVal = `$${usdVal} USD (₹${inrVal} / USD)`;
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
 * Independent card component with local time scrubber, dynamic slicing,
 * percentage-point (pp) economics math, inverse rupee purchasing power curve,
 * and dotless charts.
 */
export default function NationalPulseCard({ indicator }) {
  const isCurrency = indicator.id === "inr-usd-rate";
  // Initial scrubber state: Default to "ALL" across ALL 12 cards
  const [timeRange, setTimeRange] = useState("ALL");

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
  let isPositive = false;

  if (isCurrency) {
    latestDisplayVal = "₹95.94";
    subtextNote = "1 INR = $0.0104 USD (Plotted as USD per INR)";

    if (timeRange === "1W") {
      chartData = indicator.weeklyTimeline || [];
      xDataKey = "date";
      deltaText = "↘ -0.17% (7D Deprec)";
      isPositive = false; // Rupee weakening is rose/red
    } else if (timeRange === "1M") {
      chartData = indicator.monthlyTimeline || [];
      xDataKey = "date";
      deltaText = "↘ -0.95% (30D Deprec)";
      isPositive = false;
    } else if (timeRange === "1Y") {
      chartData = [
        { fy: "Oct 25", val: 0.01152, inrVal: 86.8 },
        { fy: "Dec 25", val: 0.01131, inrVal: 88.4 },
        { fy: "Feb 26", val: 0.01096, inrVal: 91.2 },
        { fy: "Apr 26", val: 0.01068, inrVal: 93.6 },
        { fy: "Jun 26", val: 0.01055, inrVal: 94.8 },
        { fy: "Sep 26", val: 0.01042, inrVal: 95.94 }
      ];
      xDataKey = "fy";
      deltaText = "↘ -9.5% (1Y Deprec)";
      isPositive = false;
    } else if (timeRange === "3Y") {
      const full = indicator.annualTimeline || indicator.timeline || [];
      chartData = full.slice(-3);
      xDataKey = "fy";
      deltaText = "↘ -13.2% (3Y Deprec)";
      isPositive = false;
    } else if (timeRange === "5Y") {
      const full = indicator.annualTimeline || indicator.timeline || [];
      chartData = full.slice(-5);
      xDataKey = "fy";
      deltaText = "↘ -18.9% (5Y Deprec)";
      isPositive = false;
    } else {
      // ALL
      chartData = indicator.annualTimeline || indicator.timeline || [];
      xDataKey = "fy";
      deltaText = "↘ -22.7% (FY21–FY26)";
      isPositive = false;
    }
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

    // Mathematical Rules:
    // Rate/Percentage Metrics -> Percentage-Point (pp) Deltas
    if (indicator.id === "cpi-inflation") {
      const deltaPp = Number((last - first).toFixed(1));
      isPositive = deltaPp <= 0; // Easing inflation is positive (Emerald)
      subtextNote = "RBI 4±2% Target Band";
      if (timeRange === "ALL") {
        deltaText = `↓ 1.6 pp Easing vs FY21`;
      } else {
        deltaText = deltaPp <= 0 ? `↓ ${Math.abs(deltaPp)} pp Easing` : `↑ +${deltaPp} pp Rise`;
      }
    } else if (indicator.id === "power-deficit") {
      const deltaPp = Number((last - first).toFixed(2));
      isPositive = deltaPp <= 0; // Deficit reduction is positive (Emerald)
      if (timeRange === "ALL") {
        deltaText = `↓ 0.34 pp Near-Zero Deficit`;
      } else {
        deltaText = deltaPp <= 0 ? `↓ ${Math.abs(deltaPp)} pp Deficit Cut` : `↑ +${deltaPp} pp Deficit`;
      }
    } else if (indicator.id === "jjm-coverage") {
      const deltaPp = Number((last - first).toFixed(1));
      isPositive = deltaPp >= 0; // Coverage gain is positive (Emerald)
      if (timeRange === "ALL") {
        deltaText = `↑ 40.2 pp Coverage Gain`;
      } else {
        deltaText = deltaPp >= 0 ? `↑ +${deltaPp} pp Coverage Gain` : `↓ ${deltaPp} pp Coverage`;
      }
    } else {
      // Volume/Quantity Metrics -> Relative % Change
      const pct = ((last - first) / first) * 100;
      isPositive = pct >= 0;
      deltaText = `${pct >= 0 ? "↑ +" : "↓ "}${pct.toFixed(1)}%`;
    }
  }

  // Dynamic Y-Axis Domain calculation
  let domainProp;
  let yAxisTickFormatter;

  if (isCurrency) {
    domainProp = [(dataMin) => Number((dataMin - 0.0002).toFixed(5)), (dataMax) => Number((dataMax + 0.0002).toFixed(5))];
    yAxisTickFormatter = (val) => `$${Number(val).toFixed(4)}`;
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
        <div className="flex items-baseline justify-between mt-3 mb-1 font-mono">
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

        {/* Subtext contextual note (e.g. USD per INR explanation or RBI target band) */}
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
                dataKey="val"
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
