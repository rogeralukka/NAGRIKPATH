/**
 * Adaptive Chromatic Shading Engine:
 * Dynamically computes chromatic styling, glow borders, and stroke/gradient
 * colors based on metric delta magnitude, direction of improvement, and stagnation.
 */
export function getAdaptiveChromaticTheme(delta, isStagnant = false, direction = "higher-is-better") {
  // Stagnation logic (Purple spectrum)
  if (isStagnant || (Math.abs(delta) < 1.0 && delta !== 0)) {
    return {
      text: "text-purple-400 font-medium",
      bg: "bg-purple-500/15",
      border: "border-purple-500/30",
      stroke: "#a855f7",
      fillGradient: "from-purple-500/20 to-transparent",
      badge: "Stagnant / Static"
    };
  }

  const isAdverse = direction === "lower-is-better" ? delta > 0 : delta < 0;
  const absVal = Math.abs(delta);

  if (isAdverse) {
    // Deteriorating / Depreciation (Red spectrum)
    if (absVal >= 15) {
      // Severe depreciation (Electric Crimson)
      return {
        text: "text-rose-400 font-bold",
        bg: "bg-rose-500/20",
        border: "border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.35)]",
        stroke: "#f43f5e",
        fillGradient: "from-rose-500/25 to-transparent",
        badge: "Critical Depreciation"
      };
    }
    // Moderate deterioration (Dark Burgundy)
    return {
      text: "text-red-300 font-medium",
      bg: "bg-red-950/50",
      border: "border-red-800/40",
      stroke: "#991b1b",
      fillGradient: "from-red-950/30 to-transparent",
      badge: "Moderate Decline"
    };
  } else {
    // Improving / Growth (Green spectrum)
    if (absVal >= 25) {
      // Surge growth (Neon Emerald)
      return {
        text: "text-emerald-300 font-bold",
        bg: "bg-emerald-500/20",
        border: "border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.35)]",
        stroke: "#10b981",
        fillGradient: "from-emerald-500/25 to-transparent",
        badge: "Surge Growth"
      };
    }
    // Steady growth (Dark Forest Green)
    return {
      text: "text-emerald-400 font-medium",
      bg: "bg-emerald-950/50",
      border: "border-emerald-800/40",
      stroke: "#059669",
      fillGradient: "from-emerald-950/30 to-transparent",
      badge: "Steady Growth"
    };
  }
}
