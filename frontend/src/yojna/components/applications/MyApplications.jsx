import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import { ApplicationDetailModal } from './ApplicationDetailModal';
import Icon from '../../../features/yojna-setu/components/Icon';

export const MyApplications = () => {
  const { applications } = useData();
  const { t } = useLang();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'personal' | 'business'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      // Tab filter
      if (activeTab === 'personal' && app.entityType !== 'personal') return false;
      if (activeTab === 'business' && app.entityType !== 'business') return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = app.applicationId.toLowerCase().includes(q);
        const matchScheme = app.schemeName.toLowerCase().includes(q);
        const matchEntity = app.entityName.toLowerCase().includes(q);
        const matchStatus = app.status.toLowerCase().includes(q);
        if (!matchId && !matchScheme && !matchEntity && !matchStatus) return false;
      }

      return true;
    });
  }, [applications, activeTab, searchQuery]);

  const statusBadges = {
    Approved: 'bg-[#E6F4EA] dark:bg-emerald-950/60 text-[#137333] dark:text-emerald-400 border border-emerald-200/50',
    Pending: 'bg-[#FEF7E0] dark:bg-amber-950/60 text-[#B06000] dark:text-amber-400 border border-amber-200/50',
    'In Review': 'bg-secondary-container dark:bg-blue-950/60 text-on-secondary-container dark:text-blue-300 border border-blue-200/50',
    Rejected: 'bg-[#FCE8E6] dark:bg-red-950/60 text-[#C5221F] dark:text-red-400 border border-red-200/50',
  };

  return (
    <div className="flex flex-col w-full relative min-h-screen px-4 sm:px-8 lg:px-margin-desktop py-8 pb-24">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-headline-xl text-2xl sm:text-3xl lg:text-4xl text-on-surface dark:text-[#EDEDED] font-bold mb-1">
            {t('myApplications')}
          </h1>
          <p className="font-body-lg text-xs sm:text-sm text-on-surface-variant dark:text-[#8A8F98]">
            {t('myAppsSubtitle')}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Icon
            name="search"
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-[#8A8F98]"
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-surface-container-low dark:bg-[#16191F] rounded-full text-xs sm:text-sm text-on-surface dark:text-[#EDEDED] placeholder:text-on-surface-variant/60 dark:placeholder:text-[#8A8F98]/50 outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30 dark:border-white/[0.08]"
            placeholder={t('searchApplications')}
            type="text"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2 rounded-full font-label-bold text-xs whitespace-nowrap transition-all ${
            activeTab === 'all'
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-surface-container dark:bg-[#16191F] text-on-surface dark:text-[#8A8F98] hover:bg-surface-container-high dark:hover:bg-[#1D212A] dark:hover:text-[#EDEDED]'
          }`}
        >
          {t('allApplicationsTab', { count: applications.length })}
        </button>

        <button
          onClick={() => setActiveTab('personal')}
          className={`px-5 py-2 rounded-full font-label-bold text-xs whitespace-nowrap transition-all ${
            activeTab === 'personal'
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-surface-container dark:bg-[#16191F] text-on-surface dark:text-[#8A8F98] hover:bg-surface-container-high dark:hover:bg-[#1D212A] dark:hover:text-[#EDEDED]'
          }`}
        >
          {t('personalTab', { count: applications.filter((a) => a.entityType === 'personal').length })}
        </button>

        <button
          onClick={() => setActiveTab('business')}
          className={`px-5 py-2 rounded-full font-label-bold text-xs whitespace-nowrap transition-all ${
            activeTab === 'business'
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-surface-container dark:bg-[#16191F] text-on-surface dark:text-[#8A8F98] hover:bg-surface-container-high dark:hover:bg-[#1D212A] dark:hover:text-[#EDEDED]'
          }`}
        >
          {t('businessTab', { count: applications.filter((a) => a.entityType === 'business').length })}
        </button>
      </div>

      {/* Grid of Applications */}
      {filteredApps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-surface-container-low dark:bg-[#0F1115] border dark:border-white/[0.08] rounded-2xl text-center px-4">
          <div className="w-16 h-16 rounded-full bg-surface-container dark:bg-[#16191F] flex items-center justify-center text-outline dark:text-[#8A8F98] mb-4">
            <Icon name="assignment_late" size={32} />
          </div>
          <h3 className="font-headline-md text-base font-bold text-on-surface dark:text-[#EDEDED] mb-1">
            {t('noApplicationsFound')}
          </h3>
          <p className="font-body-md text-xs text-on-surface-variant dark:text-[#8A8F98] max-w-sm">
            {searchQuery ? t('noAppsMatchQuery') : t('noAppsInCat')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <div
              key={app.applicationId}
              className="group relative bg-surface-container dark:bg-[#0F1115] rounded-3xl p-6 shadow-sm border border-outline-variant/30 dark:border-white/[0.08] hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full transform hover:-translate-y-1"
            >
              <div>
                {/* Badges Row */}
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 rounded-full bg-secondary-container dark:bg-[#16191F] text-on-secondary-container dark:text-[#EDEDED] font-status-badge text-[11px] font-bold border dark:border-white/[0.08]">
                    {app.entityType === 'business' ? `${t('business')} (${app.entityName})` : t('personal')}
                  </span>

                  <span className={`px-3 py-1 rounded-full font-status-badge text-[11px] font-bold flex items-center gap-1.5 ${statusBadges[app.status] || statusBadges.Pending}`}>
                    <Icon
                      name={app.status === 'Approved' ? 'check_circle' : app.status === 'Rejected' ? 'cancel' : 'schedule'}
                      size={14}
                    />
                    <span>{t('status_' + app.status.toLowerCase().replace(/ /g, '_'), {}, app.status)}</span>
                  </span>
                </div>

                {/* Scheme Name */}
                <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface dark:text-[#EDEDED] mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {t('scheme_' + (app.schemeIds?.[0] || ''), {}, app.schemeName)}
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant dark:text-[#8A8F98] mb-4 line-clamp-2">
                  {t('appRegisteredUnder', { category: t('category_' + app.schemeCategory.replace(/ /g, '_'), {}, app.schemeCategory) })}
                </p>

                {/* Rejection comment banner if rejected */}
                {app.status === 'Rejected' && app.adminComment && (
                  <div className="p-3 bg-error-container/30 dark:bg-error/20 border border-error/20 rounded-xl mb-4 flex gap-2 text-xs">
                    <Icon name="info" size={18} className="text-error shrink-0 mt-0.5" />
                    <p className="font-body-sm text-[11px] text-on-surface dark:text-[#EDEDED] line-clamp-2">
                      {t('rejection_' + (app.schemeIds?.[0] || 'general'), {}, app.adminComment)}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div>
                <div className="flex items-center gap-4 text-on-surface-variant dark:text-[#8A8F98] font-body-sm text-xs mb-4">
                  <div className="flex items-center gap-1.5">
                    <Icon name="calendar_today" size={14} />
                    <span>{app.appliedAt}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <Icon name="fingerprint" size={14} />
                    <span>{app.applicationId}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedApp(app)}
                  className="w-full py-2.5 rounded-xl bg-surface-container-low dark:bg-[#16191F] hover:bg-primary hover:text-white text-primary dark:text-[#EDEDED] border dark:border-white/[0.08] font-label-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>{t('viewDetails')}</span>
                  <Icon name="arrow_forward" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Detail Modal */}
      {/* Application Detail Modal */}
      <ApplicationDetailModal
        application={selectedApp}
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
      />
    </div>
  );
};

export default MyApplications;
