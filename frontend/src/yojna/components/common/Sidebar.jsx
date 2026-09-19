import React from 'react';
import { useData, CITIZEN_VIEWS } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import Icon from '../../../features/yojna-setu/components/Icon';

export const Sidebar = () => {
  const { currentView, navigateTo, isSidebarCollapsed, setIsSidebarCollapsed } = useData();
  const { t } = useLang();

  const activeView = CITIZEN_VIEWS.includes(currentView) ? currentView : 'dashboard';

  const navItems = [
    { key: 'dashboard', label: t('dashboard'), icon: 'dashboard', path: 'dashboard' },
    { key: 'my-business', label: t('myBusiness'), icon: 'storefront', path: 'my-business' },
    { key: 'my-applications', label: t('myApplications'), icon: 'description', path: 'my-applications' },
    { key: 'bookmarks', label: t('bookmarks'), icon: 'bookmark', path: 'bookmarks' },
    { key: 'notifications', label: t('notificationsUpdates'), icon: 'notifications', path: 'notifications' },
    { key: 'share-eligibility', label: t('shareEligibility'), icon: 'share', path: 'share-eligibility' },
  ];

  return (
    <>
      {/* Overlay on mobile when sidebar is open */}
      {!isSidebarCollapsed && (
        <div
          onClick={() => setIsSidebarCollapsed(true)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside
        className={`sticky top-16 h-[calc(100vh-4rem)] h-[calc(100dvh-4rem)] shrink-0 self-start z-30 bg-white dark:bg-[#0F1115] border-r-2 border-slate-300 dark:border-white/[0.08] shadow-sm transition-all duration-300 flex flex-col ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Hamburger Toggle Bar (BELOW top nav, attached to sidebar) */}
        <div className="h-12 shrink-0 border-b border-slate-200 dark:border-white/[0.08] flex items-center px-3 justify-start">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            type="button"
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center cursor-pointer"
          >
            <Icon name="menu" size={20} />
          </button>
        </div>

        {/* Navigation Items with independent vertical scrolling */}
        <nav className="p-2 space-y-1 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {navItems.map((item) => {
            const isActive = activeView === item.path;
            return (
              <button
                key={item.key}
                onClick={() => {
                  navigateTo(item.path);
                  if (window.innerWidth < 1024) {
                    setIsSidebarCollapsed(true);
                  }
                }}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 text-left cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800/60'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  className={`shrink-0 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                />

                {!isSidebarCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
