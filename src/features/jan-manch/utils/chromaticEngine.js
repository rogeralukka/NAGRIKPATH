/**
 * Adaptive Chromatic Shading Engine:
 * Strict binary semantic color system with high-contrast financial terminal styling.
 * 
 * 1. Adverse / Depreciation / Worsening:
 *    - ALWAYS ROSE/RED (#f43f5e).
 *    - Light Mode: bg-rose-50 text-rose-700 border border-rose-200
 *    - Dark Mode: dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20
 *    - Chart Stroke: #f43f5e (Rose-500)
 *    - Chart Gradient: from-rose-500/15 to-transparent
 * 
 * 2. Growth / Improvement / Favorable:
 *    - ALWAYS EMERALD GREEN (#10b981).
 *    - Light Mode: bg-emerald-50 text-emerald-700 border border-emerald-200
 *    - Dark Mode: dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20
 *    - Chart Stroke: #10b981 (Emerald-500)
 *    - Chart Gradient: from-emerald-500/15 to-transparent
 */
export function getAdaptiveChromaticTheme(delta, isStagnant = false, direction = "higher-is-better") {
  // Binary semantic evaluation:
  // In "lower-is-better" (e.g. CPI inflation easing, power deficit reduction):
  //   delta < 0 is favorable (easing/reduction), delta > 0 is adverse.
  // In "higher-is-better" (or currency depreciation where delta < 0):
  //   delta < 0 is adverse, delta >= 0 is favorable.
  const isAdverse = direction === "lower-is-better" ? delta > 0 : delta < 0;

  if (isAdverse) {
    return {
      text: "text-rose-700 dark:text-rose-400 font-bold",
      bg: "bg-rose-50 dark:bg-rose-500/10",
      border: "border-rose-200 dark:border-rose-500/20",
      stroke: "#f43f5e",
      fillGradient: "from-rose-500/15 to-transparent",
      badge: "Adverse / Depreciation",
      isAdverse: true
    };
  }

  return {
    text: "text-emerald-700 dark:text-emerald-400 font-bold",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-500/20",
    stroke: "#10b981",
    fillGradient: "from-emerald-500/15 to-transparent",
    badge: "Growth / Favorable",
    isAdverse: false
  };
}
