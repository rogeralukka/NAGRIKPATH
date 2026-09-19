import React from 'react';
import { Search } from 'lucide-react';

export const SECTOR_OPTIONS = [
  { value: 'ALL', label: 'All Sectors' },
  { value: 'Agriculture', label: 'Agriculture' },
  { value: 'Education', label: 'Education' },
  { value: 'Health', label: 'Health' },
  { value: 'Social Welfare', label: 'Social Welfare' }
];

export const MATCH_OPTIONS = [
  { value: 'ALL', label: 'All Match Levels' },
  { value: 'HIGH_MATCH', label: 'High Match' },
  { value: 'CRITERIA_CHECK', label: 'Criteria Check' }
];

/**
 * FilterBar:
 * Provides sector and match status filter controls.
 */
export function FilterBar({
  selectedSector,
  onSelectSector,
  selectedMatch,
  onSelectMatch,
  searchQuery,
  onSearchChange
}) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 p-3 rounded-xl bg-neutral-100/80 dark:bg-[#16191F] border border-neutral-200 dark:border-white/[0.08]">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search schemes by name, keyword..."
          className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] text-neutral-900 dark:text-[#EDEDED] placeholder-neutral-500 dark:placeholder-[#8A8F98] focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
        />
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-[#8A8F98] pointer-events-none" />
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Sector Selector */}
        <select
          value={selectedSector}
          onChange={(e) => onSelectSector(e.target.value)}
          className="px-3 py-2 text-xs sm:text-sm rounded-lg bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] text-neutral-900 dark:text-[#EDEDED] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          {SECTOR_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#0F1115] text-neutral-900 dark:text-[#EDEDED]">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Match Status Selector */}
        <select
          value={selectedMatch}
          onChange={(e) => onSelectMatch(e.target.value)}
          className="px-3 py-2 text-xs sm:text-sm rounded-lg bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] text-neutral-900 dark:text-[#EDEDED] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          {MATCH_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#0F1115] text-neutral-900 dark:text-[#EDEDED]">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterBar;

