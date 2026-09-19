import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Megaphone, Bell } from "lucide-react";
import { useUI } from "../../context/UIContext";
import Icon from "../../features/yojna-setu/components/Icon";

/**
 * Hub Sidebar component.
 * Collapsible to icon-only mode.
 * Hamburger toggle rendered BELOW the top nav bar, on the left, attached to the sidebar itself.
 * Items: All Services, Jan Manch, Notifications.
 */
export default function Sidebar() {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useUI();

  const navItems = [
    {
      path: "/home",
      label: "All Services",
      icon: LayoutDashboard,
      matchPrefix: false
    },
    {
      path: "/jan-manch",
      label: "Jan Manch",
      icon: Megaphone,
      matchPrefix: false
    },
    {
      path: "/notifications",
      label: "Notifications",
      icon: Bell,
      matchPrefix: false
    }
  ];

  return (
    <aside
      className={`sticky top-16 h-[calc(100vh-4rem)] h-[calc(100dvh-4rem)] shrink-0 self-start z-30 bg-white dark:bg-[#0F1115] border-r-2 border-slate-300 dark:border-white/[0.08] shadow-sm transition-all duration-300 flex flex-col ${
        sidebarCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Hamburger Toggle Bar (BELOW top nav, attached to sidebar) */}
      <div className="h-12 shrink-0 border-b border-slate-200 dark:border-white/[0.08] flex items-center px-3 justify-start">
        <button
          onClick={toggleSidebar}
          type="button"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center cursor-pointer"
        >
          <Icon name="menu" size={20} />
        </button>
      </div>

      {/* Nav items with independent vertical scrolling */}
      <nav className="p-2 space-y-1 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={sidebarCollapsed ? item.label : undefined}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800/60"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <IconComponent
                size={20}
                className={`shrink-0 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
