import React from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import Icon from '../../../features/yojna-setu/components/Icon';

export const Bookmarks = () => {
  const { schemes, bookmarks, toggleBookmark, navigateTo } = useData();
  const { t } = useLang();

  const bookmarkedSchemes = schemes.filter((s) => bookmarks.includes(s.id));

  return (
    <div className="flex flex-col w-full relative min-h-screen px-4 sm:px-8 lg:px-margin-desktop py-8 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-headline-xl text-2xl sm:text-3xl lg:text-4xl text-on-surface dark:text-[#EDEDED] font-bold mb-1">
          {t('bookmarks')}
        </h1>
        <p className="font-body-lg text-xs sm:text-sm text-on-surface-variant dark:text-[#8A8F98]">
          {t('bookmarksSubtitle')}
        </p>
      </div>

      {bookmarkedSchemes.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center min-h-[420px] text-center p-6 bg-surface-container-low/50 dark:bg-[#0F1115] rounded-3xl border border-outline-variant/20 dark:border-white/[0.08]">
          <div className="w-20 h-20 bg-surface-container dark:bg-[#16191F] rounded-full flex items-center justify-center mb-5 shadow-sm relative">
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-75" />
            <Icon name="bookmark" size={40} className="text-primary dark:text-primary-fixed relative z-10" />
          </div>

          <h2 className="font-headline-lg text-xl font-bold text-on-surface dark:text-[#EDEDED] mb-2">
            {t('noBookmarksYet')}
          </h2>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant dark:text-[#8A8F98] mb-6 max-w-md">
            {t('noBookmarksDesc')}
          </p>

          <button
            onClick={() => navigateTo('dashboard')}
            className="bg-primary text-on-primary font-label-bold text-xs sm:text-sm px-6 py-3 rounded-xl hover:scale-105 transition-all shadow-md flex items-center gap-2"
          >
            <Icon name="explore" size={18} />
            <span>{t('browseSchemes')}</span>
          </button>
        </div>
      ) : (
        /* Bookmarked Schemes Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-surface-container dark:bg-[#0F1115] rounded-2xl p-6 shadow-sm border border-outline-variant/30 dark:border-white/[0.08] hover:shadow-lg transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-primary/5 dark:bg-primary/10 rounded-bl-full -mr-6 -mt-6 pointer-events-none group-hover:bg-primary/10 transition-colors" />

              <div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="bg-surface-container-high dark:bg-[#16191F] border dark:border-white/[0.08] rounded-full px-3 py-1 flex items-center gap-1.5">
                      <span className="font-status-badge text-[10px] font-bold text-on-surface-variant dark:text-[#EDEDED] uppercase tracking-wider">
                        {t('category_' + scheme.category.replace(/ /g, '_'), {}, scheme.category)}
                      </span>
                    </div>

                    {scheme.governmentLevel === 'state' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-secondary-container/60 dark:bg-[#16191F] text-on-secondary-container dark:text-[#EDEDED] border border-outline-variant/30 dark:border-white/[0.08]">
                        {scheme.applicableStates && scheme.applicableStates.length === 1
                          ? scheme.applicableStates[0]
                          : `STATE · ${scheme.applicableStates?.length || 1} STATES`}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-primary-fixed/40 dark:bg-primary/20 text-on-primary-fixed-variant dark:text-primary-fixed border border-primary/20">
                        {t('centralGovBadge', {}, 'CENTRAL')}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleBookmark(scheme.id)}
                    className="text-amber-500 hover:scale-110 transition-transform p-1"
                    title={t('removeBookmark')}
                    aria-label={t('removeBookmark')}
                  >
                    <Icon name="star" size={22} className="text-amber-500 fill-amber-500" />
                  </button>
                </div>

                <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface dark:text-[#EDEDED] mb-2 relative z-10 line-clamp-1 group-hover:text-primary transition-colors">
                  {t('scheme_' + scheme.id, {}, scheme.name)}
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant dark:text-[#8A8F98] mb-6 line-clamp-2 relative z-10">
                  {t('desc_' + scheme.id, {}, scheme.description)}
                </p>
              </div>

              <div className="mt-auto relative z-10 flex gap-2">
                <button
                  onClick={() => navigateTo('application-form', [scheme])}
                  className="flex-1 bg-primary text-on-primary font-label-bold text-xs py-2.5 rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>{t('applyNow')}</span>
                  <Icon name="arrow_forward" size={16} />
                </button>

                <button
                  onClick={() => navigateTo('scheme-detail', scheme.id)}
                  className="px-3 py-2.5 bg-surface-container-low dark:bg-[#16191F] border dark:border-white/[0.08] text-on-surface dark:text-[#EDEDED] font-label-bold text-xs rounded-xl hover:bg-surface-container-high dark:hover:bg-[#1D212A] transition-colors"
                  title={t('viewDetails')}
                  aria-label={t('viewDetails')}
                >
                  <Icon name="info" size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
