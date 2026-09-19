import React from "react";
import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import AuthModal from "../../features/auth/AuthModal";
import { useUI } from "../../context/UIContext";

/**
 * PublicLayout: Landing Page & Auth Modal
 * TopNav with ThemeToggle, LanguageSelector, Get Started.
 * No sidebar, no hamburger, no back button.
 */
export default function PublicLayout() {
  const { isAuthModalOpen, closeAuthModal } = useUI();

  return (
    <div className="min-h-screen flex flex-col bg-black text-slate-900 dark:text-slate-100 overflow-x-hidden transition-colors duration-300 ease-in-out">
      <TopNav isPublic={true} />
      <main className="flex-1 flex flex-col relative overflow-x-hidden">
        <Outlet />
      </main>
      {isAuthModalOpen && <AuthModal onClose={closeAuthModal} />}
    </div>
  );
}
