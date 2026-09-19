import React from "react";
import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import { LangProvider } from "../../yojna/context/LangContext";
import { AuthProvider } from "../../yojna/context/AuthContext";
import { DataProvider } from "../../yojna/context/DataContext";

/**
 * YojnaLayout: Standalone module layout for Yojna Setu.
 * Wraps the route in native Yojna Setu context providers (Lang, Auth, Data)
 * and renders the context-aware TopNav with YojanaSetu branding.
 */
export default function YojnaLayout() {
  return (
    <LangProvider>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen bg-neutral-50 dark:bg-[#08090A] text-neutral-900 dark:text-[#EDEDED] flex flex-col font-body-lg">
            <TopNav isPublic={false} />
            <Outlet />
          </div>
        </DataProvider>
      </AuthProvider>
    </LangProvider>
  );
}

