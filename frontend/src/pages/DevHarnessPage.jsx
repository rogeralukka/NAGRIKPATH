import React, { useState } from "react";
import Phase1Harness from "../Phase1Harness";
import { ErrorBoundary } from "../components/shared/ErrorBoundary";
import { JanManchSkeleton, SchemeGridSkeleton } from "../components/shared/skeletons";
import { AlertCircle, RotateCcw, Bug, Sparkles } from "lucide-react";

function CrashComponent({ shouldCrash }) {
  if (shouldCrash) {
    throw new Error("Simulated rendering crash in Financial Analytics Widget.");
  }
  return (
    <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-sm">
      ✓ Component is operating normally without errors.
    </div>
  );
}

/**
 * DevHarnessPage (/dev/harness):
 * Dev-only route rendering Phase1Harness and resilience testing harness.
 */
export default function DevHarnessPage() {
  const [activeTab, setActiveTab] = useState("engine");
  const [shouldCrash, setShouldCrash] = useState(false);

  return (
    <div className="min-h-screen bg-[#08090A] text-white">
      {/* Dev Harness Navigation Bar */}
      <div className="border-b border-white/[0.08] bg-[#0F1115] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold tracking-wider uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Dev Harness
          </span>
          <span className="text-sm font-semibold text-neutral-300">NagrikPath Sandbox</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("engine")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "engine"
                ? "bg-white/[0.1] text-white border border-white/[0.15]"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Phase 1 Engine
          </button>
          <button
            onClick={() => setActiveTab("resilience")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "resilience"
                ? "bg-white/[0.1] text-white border border-white/[0.15]"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Resilience & Skeletons
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "engine" ? (
        <Phase1Harness />
      ) : (
        <div className="max-w-6xl mx-auto p-8 space-y-12">
          {/* Section 1: Error Boundary Sandbox */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Bug className="w-5 h-5 text-rose-400" />
                  React Error Boundary Isolation Test
                </h2>
                <p className="text-xs text-neutral-400">
                  Trigger an intentional rendering crash to verify the Obsidian fallback card (#0F1115 / #16191F) and recovery button.
                </p>
              </div>
              <button
                onClick={() => setShouldCrash((prev) => !prev)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  shouldCrash
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                }`}
              >
                {shouldCrash ? "Reset Normal State" : "Simulate Widget Crash"}
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F1115] border border-white/[0.08]">
              <ErrorBoundary moduleName="Financial Analytics Widget">
                <CrashComponent shouldCrash={shouldCrash} />
              </ErrorBoundary>
            </div>
          </section>

          {/* Section 2: Jan Manch Skeletons */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Jan Manch Skeleton Wireframe (h-72 min-h-[288px] Zero CLS)
              </h2>
              <p className="text-xs text-neutral-400">
                CSS-only pulse shimmer mimicking sector tabs and dual-axis financial/physical charts.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#0F1115] border border-white/[0.08]">
              <JanManchSkeleton />
            </div>
          </section>

          {/* Section 3: Yojna Scheme Grid Skeletons */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Yojna Setu Scheme Grid Skeleton (3-Column Card Wireframe)
              </h2>
              <p className="text-xs text-neutral-400">
                Mimics exact SchemeCard geometry with tags, title, benefit container, and CTA buttons.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#0F1115] border border-white/[0.08]">
              <SchemeGridSkeleton count={3} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
