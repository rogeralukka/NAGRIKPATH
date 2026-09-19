import React from "react";
import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";

/**
 * ProfileLayout: Full-screen takeover for Unified Family Profile.
 * No sidebar, no hamburger.
 * Context logo in TopNav resolves from navigation state or last module.
 */
export default function ProfileLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-[#08090A] text-slate-900 dark:text-[#EDEDED] transition-colors duration-300 ease-in-out">
      <TopNav isPublic={false} />
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
