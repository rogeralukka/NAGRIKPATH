import React from 'react';
import Icon from './Icon';

/**
 * SchemeHeader:
 * Displays dynamic citizen greeting, profile context chips, and executive recommendation engine card.
 */
export function SchemeHeader({ activeMember, totalEligible, eligibleReadyCount, eligibleBlockedCount }) {
  const citizenName = activeMember?.name || 'Citizen';
  const category = activeMember?.category || 'OBC';
  const occupation = activeMember?.occupation || 'Student';
  const stateName = activeMember?.state || 'Telangana';
  const age = activeMember?.age ?? 19;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center mb-6">
      {/* Left Column: Greeting & Profile Chips */}
      <div className="lg:col-span-2 space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-[#EDEDED]">
          Hello, {citizenName}! You are eligible for {totalEligible} schemes.
        </h1>
        
        <p className="text-sm text-neutral-600 dark:text-[#8A8F98]">
          {eligibleReadyCount} ready to apply · {eligibleBlockedCount} with document actions pending
        </p>

        {/* Profile Context Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#16191F] text-neutral-700 dark:text-[#EDEDED] border border-neutral-200 dark:border-white/[0.08] shadow-xs">
            <Icon name="user" size={14} className="text-blue-500" />
            <span>Category: <strong className="font-semibold">{category}</strong></span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#16191F] text-neutral-700 dark:text-[#EDEDED] border border-neutral-200 dark:border-white/[0.08] shadow-xs">
            <Icon name="briefcase" size={14} className="text-purple-500" />
            <span>{occupation}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#16191F] text-neutral-700 dark:text-[#EDEDED] border border-neutral-200 dark:border-white/[0.08] shadow-xs">
            <Icon name="location_on" size={14} className="text-emerald-500" />
            <span>{stateName}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#16191F] text-neutral-700 dark:text-[#EDEDED] border border-neutral-200 dark:border-white/[0.08] shadow-xs">
            <Icon name="calendar_today" size={14} className="text-amber-500" />
            <span>Age: <strong className="font-semibold">{age}</strong></span>
          </div>
        </div>
      </div>

      {/* Right Column: Recommendation Engine Card */}
      <div className="lg:col-span-1 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] shadow-sm">
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-neutral-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Icon name="cpu" size={16} className="text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-[#EDEDED]">
              Recommendation Engine
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#16191F] border border-neutral-100 dark:border-white/[0.04]">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-[#8A8F98] block">
              Ready to Apply
            </span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
              {eligibleReadyCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#16191F] border border-neutral-100 dark:border-white/[0.04]">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-[#8A8F98] block">
              Prerequisites Pending
            </span>
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 block mt-0.5">
              {eligibleBlockedCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchemeHeader;

