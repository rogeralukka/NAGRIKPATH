import React from "react";
import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";
import AgenticDrawer from "../../features/agent/AgenticDrawer";
import { useUI } from "../../context/UIContext";

/**
 * HubLayout: NagrikPath Main Services (Home, Jan Manch, Notifications)
 * Features TopNav, collapsible Sidebar, and floating AgenticDrawer on hub routes.
 */
export default function HubLayout() {
  const { sidebarCollapsed } = useUI();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-[#08090A] text-slate-900 dark:text-[#EDEDED] transition-colors duration-300 ease-in-out">
      <TopNav isPublic={false} />
      <div className="flex-1 flex relative items-start">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating Action Agent Telemetry Drawer */}
      <AgenticDrawer />
    </div>
  );
}
