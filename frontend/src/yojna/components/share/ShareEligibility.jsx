import React, { useState } from 'react';
import { useHousehold } from '../../../context/HouseholdContext';
import { useSchemeEvaluation } from '../../../features/yojna-setu/hooks/useSchemeEvaluation';
import { useLang } from '../../context/LangContext';
import { useData } from '../../context/DataContext';
import { verifyPinHash, hashString } from '../../../lib/utils/hash';
import Icon from '../../../features/yojna-setu/components/Icon';

export const ShareEligibility = () => {
  const { activeMember } = useHousehold();
  const { evaluatedSchemes, totalEligible, eligibleReadyCount, eligibleBlockedCount } = useSchemeEvaluation();
  const { showToast, navigateTo } = useData();
  const { t } = useLang();

  const [pin, setPin] = useState('');
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [pinError, setPinError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const eligibleList = evaluatedSchemes.filter((s) => s.state !== 'INELIGIBLE');

  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (!pin.trim()) {
      setPinError('Please enter your 4-digit security PIN.');
      return;
    }

    if (activeMember?.pinHash) {
      if (verifyPinHash(pin, activeMember.pinHash)) {
        setIsPinVerified(true);
        setPinError('');
      } else {
        setPinError('Incorrect PIN. Please check your credentials.');
      }
    } else {
      // Fallback if no pinHash is configured
      if (pin.length === 4) {
        setIsPinVerified(true);
        setPinError('');
      } else {
        setPinError('PIN must be 4 digits.');
      }
    }
  };

  // Generate deterministic client-side share token
  const sharePayload = JSON.stringify({
    memberId: activeMember?.id || 'citizen',
    name: activeMember?.name || 'Citizen',
    totalEligible,
    eligibleReadyCount,
    eligibleBlockedCount,
    schemes: eligibleList.map((s) => s.id).sort()
  });

  const shareCode = `NP-SHR-${hashString(sharePayload) || '4F89A2B1'}`.toUpperCase();
  const shareUrl = `${window.location.origin}/share/eligibility?code=${shareCode}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
    setIsCopied(true);
    showToast(t('linkCopiedToast') || 'Share link copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDownloadPdf = () => {
    showToast('Generating official offline summary certificate...');
    window.print();
  };

  return (
    <div className="flex flex-col w-full items-center justify-center p-4 sm:p-6 lg:p-10 min-h-[calc(100vh-64px)] animate-fade-in-up">
      {/* Modal / Card */}
      <div className="relative w-full max-w-2xl bg-surface-container-lowest dark:bg-[#0F1115] rounded-3xl shadow-2xl border border-outline-variant/30 dark:border-white/[0.08] overflow-hidden">
        {/* Glows */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 bg-surface-container-low/60 dark:bg-[#16191F] border-b border-surface-variant dark:border-white/[0.08] relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
              <Icon name="ios_share" size={24} />
            </div>
            <div>
              <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface dark:text-[#EDEDED]">
                {t('shareEligibilityTitle')}
              </h2>
              <p className="font-body-sm text-xs text-on-surface-variant dark:text-[#8A8F98] mt-0.5">
                Consent-Gated Offline Eligibility Packet
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('dashboard')}
            className="w-9 h-9 rounded-full bg-surface-container dark:bg-[#16191F] border dark:border-white/[0.08] hover:bg-surface-container-high dark:hover:bg-[#1D212A] text-on-surface-variant dark:text-[#8A8F98] transition-colors flex items-center justify-center"
            title="Close"
            aria-label="Close"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* Card Content */}
        {!isPinVerified ? (
          /* PIN Verification Gate */
          <div className="p-6 sm:p-8 relative z-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Icon name="lock" size={28} />
            </div>

            <h3 className="text-lg font-bold text-neutral-900 dark:text-[#EDEDED] mb-1">
              Citizen Authorization Required
            </h3>
            <p className="text-xs text-neutral-600 dark:text-[#8A8F98] max-w-sm mb-6">
              Enter the 4-digit citizen security PIN for <strong>{activeMember?.name || 'Citizen'}</strong> to authorize generation of the eligibility share code.
            </p>

            <form onSubmit={handleVerifyPin} className="w-full max-w-xs space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setPinError('');
                  }}
                  placeholder="••••"
                  className="w-full text-center text-2xl tracking-[0.5em] font-mono py-3 bg-neutral-100 dark:bg-[#16191F] border border-neutral-300 dark:border-white/[0.08] rounded-2xl text-neutral-900 dark:text-[#EDEDED] outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs text-rose-500 mt-2 font-medium">{pinError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Icon name="shield" size={16} />
                <span>Verify & Unlock Share Summary</span>
              </button>
            </form>
          </div>
        ) : (
          /* Verified Share Summary */
          <div className="p-6 sm:p-8 relative z-10 flex flex-col gap-6">
            {/* Applicant Summary Card */}
            <div className="bg-surface-container-low dark:bg-[#16191F] rounded-2xl p-5 shadow-sm border border-outline-variant/30 dark:border-white/[0.08] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-label-bold text-xs uppercase tracking-wider text-on-surface dark:text-[#EDEDED]">
                  {t('applicantProfile')}
                </span>
                <span className="font-status-badge text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-0.5 rounded-full font-bold inline-flex items-center gap-1">
                  <Icon name="check_circle" size={12} />
                  {t('verifiedResident')}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-3 text-xs">
                <div className="flex flex-col gap-0.5">
                  <span className="text-on-surface-variant dark:text-[#8A8F98]">{t('fullName')}</span>
                  <span className="font-semibold text-on-surface dark:text-[#EDEDED] truncate">
                    {activeMember?.name || 'Citizen'}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-on-surface-variant dark:text-[#8A8F98]">{t('age')}</span>
                  <span className="font-semibold text-on-surface dark:text-[#EDEDED]">
                    {activeMember?.age || 19} Years
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-on-surface-variant dark:text-[#8A8F98]">{t('state')}</span>
                  <span className="font-semibold text-on-surface dark:text-[#EDEDED]">
                    {activeMember?.state || 'Telangana'}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-on-surface-variant dark:text-[#8A8F98]">{t('category')}</span>
                  <span className="font-semibold text-on-surface dark:text-[#EDEDED]">
                    {activeMember?.category || 'OBC'}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5 sm:col-span-2">
                  <span className="text-on-surface-variant dark:text-[#8A8F98]">Discovered Entitlements</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {totalEligible} Schemes ({eligibleReadyCount} Ready · {eligibleBlockedCount} Action Pending)
                  </span>
                </div>
              </div>
            </div>

            {/* Qualified Schemes List */}
            <div className="flex flex-col gap-3">
              <h3 className="font-label-bold text-xs uppercase tracking-wider text-on-surface dark:text-[#EDEDED]">
                {t('eligibleSchemesTitle', { count: eligibleList.length })}
              </h3>

              <ul className="flex flex-col gap-2.5">
                {eligibleList.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-start gap-3.5 p-3.5 rounded-xl bg-surface-container-low dark:bg-[#16191F] border border-outline-variant/30 dark:border-white/[0.08]"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      <Icon name="check" size={14} />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-body-md text-xs sm:text-sm text-on-surface dark:text-[#EDEDED] font-bold truncate">
                        {s.name}
                      </span>
                      <span className="font-body-sm text-xs text-neutral-500 dark:text-[#8A8F98] font-medium">
                        {s.benefitSummary || s.benefit || 'Direct Entitlement'} • {s.level || 'Central'} Level
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Local Zero-Transmission Note */}
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2.5">
              <Icon name="shield" size={16} className="shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
              <div>
                <strong className="block font-semibold">Local Zero-Knowledge Synthesis:</strong>
                <span>This share summary and hash digest are computed 100% locally inside your browser using client-side deterministic evaluation. Zero personal telemetry or packet data is transmitted to external servers.</span>
              </div>
            </div>

            {/* Share Code Field */}
            <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-[#16191F] border border-neutral-200 dark:border-white/[0.08] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-[#8A8F98] block">
                  Deterministic Share Code
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-neutral-900 dark:text-[#EDEDED] truncate block">
                  {shareCode}
                </span>
              </div>

              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-lg bg-neutral-200 dark:bg-[#1D212A] hover:bg-neutral-300 dark:hover:bg-[#252A35] text-neutral-800 dark:text-[#EDEDED] text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5"
              >
                <Icon name={isCopied ? 'check' : 'copy'} size={14} />
                <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        {isPinVerified && (
          <div className="flex items-center justify-end gap-3 p-5 sm:p-6 bg-surface-container-low/60 dark:bg-[#16191F] border-t border-surface-variant dark:border-white/[0.08] relative z-10">
            <button
              onClick={handleDownloadPdf}
              className="px-5 py-2.5 rounded-full flex items-center gap-2 font-label-bold text-xs text-secondary dark:text-[#EDEDED] border border-outline-variant dark:border-white/[0.08] hover:bg-surface-container dark:hover:bg-[#1D212A] transition-all hover:scale-105"
            >
              <Icon name="picture_as_pdf" size={18} />
              <span>{t('downloadPdf')}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-6 py-2.5 rounded-full flex items-center gap-2 font-label-bold text-xs text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              <Icon name={isCopied ? 'check' : 'content_copy'} size={18} />
              <span>{isCopied ? 'Copied!' : t('copyLink')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareEligibility;
