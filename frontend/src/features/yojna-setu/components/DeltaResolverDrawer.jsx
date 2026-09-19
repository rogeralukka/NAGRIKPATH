import React, { useState, useEffect } from 'react';
import { useHousehold } from '../../../context/HouseholdContext';
import {
  GitFork,
  X,
  AlertTriangle,
  Loader2,
  CloudDownload,
  FolderX,
  CheckCircle2,
  Lock
} from 'lucide-react';

/**
 * DeltaResolverDrawer:
 * Slide-over drawer presenting prerequisite document deltas and simulated DPI pull actions.
 * Enforces Esc ownership, dynamic head-of-household name resolution, and verbatim strings.
 */
export function DeltaResolverDrawer({ isOpen, onClose, scheme, onSynthesizeDocket }) {
  const { activeMember, headOfHousehold, simulateIssuancePull } = useHousehold();
  const [pullingDocTag, setPullingDocTag] = useState(null);

  // Esc key listener for drawer
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !scheme) return null;

  const delta = scheme.delta || { fulfilledDocs: [], missingDocs: [], expiredDocs: [], status: 'BLOCKED' };
  const isReady = delta.status === 'READY' || (delta.missingDocs.length === 0 && delta.expiredDocs.length === 0);

  const handleFetchIssuance = (doc) => {
    if (!doc || pullingDocTag) return;
    const targetMemberId = doc.ownerMemberId || headOfHousehold?.memberId;
    if (!targetMemberId) return;

    setPullingDocTag(doc.docTag);

    // 1.5s simulated DPI Pull
    setTimeout(() => {
      simulateIssuancePull(targetMemberId, doc.docTag);
      setPullingDocTag(null);
    }, 1500);
  };

  const headName = headOfHousehold?.name || 'Head of Household';

  return (
    <div
      data-modal-open="true"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg h-full bg-white dark:bg-[#0F1115] border-l border-neutral-200 dark:border-white/[0.08] shadow-2xl flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-white/[0.08] flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 mb-2">
              <GitFork className="w-3.5 h-3.5" />
              ELIGIBILITY DELTA RESOLUTION
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-[#EDEDED]">
              {scheme.name}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-[#8A8F98] mt-1">
              Applicant: <span className="font-semibold text-neutral-800 dark:text-[#EDEDED]">{activeMember?.name}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-500 dark:text-[#8A8F98] hover:bg-neutral-100 dark:hover:bg-[#16191F] hover:text-neutral-900 dark:hover:text-[#EDEDED] transition-colors"
            title="Close Drawer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Document Checklist */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-white/[0.06]">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-[#8A8F98]">
              Prerequisite Credentials & Ledger Audit
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                isReady
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              }`}
            >
              {isReady ? 'All Criteria Satisfied' : 'Action Required'}
            </span>
          </div>

          {/* Expired Documents Section */}
          {delta.expiredDocs && delta.expiredDocs.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Expired Prerequisites ({delta.expiredDocs.length})
              </h4>
              {delta.expiredDocs.map((doc) => {
                const isCurrentlyPulling = pullingDocTag === doc.docTag;
                const expiryText = doc.inheritedFromHead
                  ? `Inherited from Head of Household — EXPIRED (${doc.formattedExpiry || '31-03-2024'})`
                  : `Document EXPIRED (${doc.formattedExpiry || '31-03-2024'})`;

                return (
                  <div
                    key={doc.docTag}
                    className="p-4 rounded-xl bg-amber-500/[0.05] dark:bg-amber-500/[0.08] border border-amber-500/25 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-bold text-neutral-900 dark:text-[#EDEDED]">
                            {doc.label}
                          </div>
                          <div className="text-xs font-mono text-amber-700 dark:text-amber-400 mt-0.5">
                            {expiryText}
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300">
                        EXPIRED
                      </span>
                    </div>

                    <button
                      onClick={() => handleFetchIssuance(doc)}
                      disabled={isCurrentlyPulling}
                      className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      {isCurrentlyPulling ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Querying State e-District Gateway...
                        </>
                      ) : (
                        <>
                          <CloudDownload className="w-4 h-4" />
                          Fetch Latest Issuance (State e-District via DigiLocker Pull API)
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Missing Documents Section (NOT_UPLOADED) */}
          {delta.missingDocs && delta.missingDocs.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-[#8A8F98]">
                Missing Credentials ({delta.missingDocs.length})
              </h4>
              {delta.missingDocs.map((doc) => (
                <div
                  key={doc.docTag}
                  className="p-3.5 rounded-xl bg-neutral-100 dark:bg-[#16191F] border border-neutral-200 dark:border-white/[0.08] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <FolderX className="w-5 h-5 text-neutral-400 dark:text-[#8A8F98]" />
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-[#EDEDED]">
                        {doc.label}
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-[#8A8F98]">
                        Required for direct eligibility verification
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono text-neutral-500 dark:text-[#8A8F98] bg-neutral-200/60 dark:bg-white/[0.06] border border-neutral-300 dark:border-white/[0.08]">
                    Not in vault
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Fulfilled / Verified Documents Section */}
          {delta.fulfilledDocs && delta.fulfilledDocs.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Verified In Ledger ({delta.fulfilledDocs.length})
              </h4>
              {delta.fulfilledDocs.map((doc) => (
                <div
                  key={doc.docTag}
                  className="p-3.5 rounded-xl bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06] border border-emerald-500/20 flex items-center justify-between"
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-[#EDEDED]">
                        {doc.label}
                      </div>
                      <div className="text-[11px] text-neutral-600 dark:text-[#8A8F98] mt-0.5">
                        {doc.inheritedFromHead
                          ? `Verified via Head of Household: ${headName}`
                          : `Verified & Linked (${doc.issuer || 'DigiLocker'})`}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    VERIFIED
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Drawer CTA Footer */}
        <div className="p-6 border-t border-neutral-200 dark:border-white/[0.08] bg-neutral-50 dark:bg-[#0F1115]">
          {isReady ? (
            <button
              onClick={() => onSynthesizeDocket(scheme)}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              Synthesize Application Docket →
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-neutral-400 dark:text-[#8A8F98] bg-neutral-200 dark:bg-[#16191F] border border-neutral-300 dark:border-white/[0.08] cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Resolve Prerequisites Above to Synthesize
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeltaResolverDrawer;

