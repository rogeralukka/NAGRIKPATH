import React, { useState, useMemo } from 'react';
import { SearchX } from 'lucide-react';
import { useSchemeEvaluation } from '../../features/yojna-setu/hooks/useSchemeEvaluation';
import { SchemeHeader } from '../../features/yojna-setu/components/SchemeHeader';
import { FilterBar } from '../../features/yojna-setu/components/FilterBar';
import { SchemeCard } from '../../features/yojna-setu/components/SchemeCard';
import { DeltaResolverDrawer } from '../../features/yojna-setu/components/DeltaResolverDrawer';
import { DocketPreviewModal } from '../../features/yojna-setu/components/DocketPreviewModal';

/**
 * YojnaDashboard (/yojna-setu):
 * Primary view orchestrating dynamic scheme evaluation, discriminated single-overlay state,
 * and seamless eligibility delta resolution.
 */
export function YojnaDashboard() {
  const {
    evaluatedSchemes,
    eligibleReadyCount,
    eligibleBlockedCount,
    totalEligible,
    activeMember,
    headOfHousehold
  } = useSchemeEvaluation();

  // Discriminated Single-Overlay State: exactly ONE overlay exists in the DOM at any given moment
  const [activeOverlay, setActiveOverlay] = useState({ type: null, schemeId: null });

  // Filtering State
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedMatch, setSelectedMatch] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Find the currently active scheme reactively from evaluatedSchemes
  const currentActiveScheme = useMemo(() => {
    if (!activeOverlay.schemeId) return null;
    return evaluatedSchemes.find((s) => s.id === activeOverlay.schemeId) || null;
  }, [activeOverlay.schemeId, evaluatedSchemes]);

  // Overlay Handlers enforcing Single-Overlay Invariant
  const handleInspectDelta = (scheme) => {
    setActiveOverlay({ type: 'drawer', schemeId: scheme.id });
  };

  const handleSynthesizeDocket = (scheme) => {
    setActiveOverlay({ type: 'modal', schemeId: scheme.id });
  };

  const handleCloseOverlay = () => {
    setActiveOverlay({ type: null, schemeId: null });
  };

  // Filter schemes
  const filteredSchemes = useMemo(() => {
    return evaluatedSchemes.filter((scheme) => {
      // 1. Sector Filter
      if (selectedSector !== 'ALL') {
        if (scheme.sector?.toLowerCase() !== selectedSector.toLowerCase()) {
          return false;
        }
      }

      // 2. Match Status Filter
      if (selectedMatch === 'HIGH_MATCH') {
        if (scheme.state !== 'ELIGIBLE-READY') return false;
      } else if (selectedMatch === 'CRITERIA_CHECK') {
        if (scheme.state !== 'ELIGIBLE-BLOCKED') return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = scheme.name.toLowerCase().includes(q);
        const matchSector = (scheme.sector || '').toLowerCase().includes(q);
        if (!matchName && !matchSector) return false;
      }

      return true;
    });
  }, [evaluatedSchemes, selectedSector, selectedMatch, searchQuery]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Top Scheme Header */}
      <SchemeHeader
        activeMember={activeMember}
        totalEligible={totalEligible}
        eligibleReadyCount={eligibleReadyCount}
        eligibleBlockedCount={eligibleBlockedCount}
      />

      {/* Filter Toolbar */}
      <FilterBar
        selectedSector={selectedSector}
        onSelectSector={setSelectedSector}
        selectedMatch={selectedMatch}
        onSelectMatch={setSelectedMatch}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Scheme Cards Grid */}
      {filteredSchemes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              onInspectDelta={handleInspectDelta}
              onSynthesizeDocket={handleSynthesizeDocket}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] shadow-sm">
          <SearchX className="w-10 h-10 text-neutral-400 dark:text-[#8A8F98] mx-auto mb-2" />
          <p className="text-sm font-medium text-neutral-600 dark:text-[#8A8F98]">
            No schemes currently indexed for this sector in PoC cache.
          </p>
        </div>
      )}

      {/* Discriminated Overlays: Mathematically at most ONE overlay can mount at any time */}
      {activeOverlay.type === 'drawer' && currentActiveScheme && (
        <DeltaResolverDrawer
          isOpen={true}
          scheme={currentActiveScheme}
          onClose={handleCloseOverlay}
          onSynthesizeDocket={handleSynthesizeDocket}
        />
      )}

      {activeOverlay.type === 'modal' && currentActiveScheme && (
        <DocketPreviewModal
          isOpen={true}
          scheme={currentActiveScheme}
          onClose={handleCloseOverlay}
        />
      )}
    </div>
  );
}

export default YojnaDashboard;
