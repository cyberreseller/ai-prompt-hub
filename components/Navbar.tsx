"use client";

import React from "react";
import { Sparkles, Plus, User, LogOut, Cpu, Shield, BookOpen, Layers } from "lucide-react";

export interface CurrentUser {
  id: string;
  email: string;
  username: string;
  role: string;
}

export type ViewType = "catalog" | "playground" | "models" | "safety";

interface NavbarProps {
  currentUser: CurrentUser | null;
  activeView: ViewType;
  onChangeView: (v: ViewType) => void;
  onOpenAuth: () => void;
  onOpenAdd: () => void;
  onLogout: () => void;
}

export function Navbar({
  currentUser,
  activeView,
  onChangeView,
  onOpenAuth,
  onOpenAdd,
  onLogout,
}: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 pt-3 pointer-events-none">
      <div className="max-w-6xl mx-auto glass-pill rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between pointer-events-auto transition-all duration-300">
        {/* Brand & Logo */}
        <div
          onClick={() => onChangeView("catalog")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-sm tracking-tight text-white">PromptHub</span>
            <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
              MVP
            </span>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#07090e]/80 p-1 rounded-full border border-white/[0.06]">
          <button
            onClick={() => onChangeView("catalog")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeView === "catalog"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-[#8f9ba8] hover:text-white"
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 ${activeView === "catalog" ? "text-white" : "text-indigo-400"}`} />
            <span>Каталог</span>
          </button>
          <button
            onClick={() => onChangeView("playground")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeView === "playground"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-[#8f9ba8] hover:text-white"
            }`}
          >
            <Cpu className={`w-3.5 h-3.5 ${activeView === "playground" ? "text-white" : "text-cyan-400"}`} />
            <span>LLM Playground</span>
          </button>
          <button
            onClick={() => onChangeView("models")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeView === "models"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-[#8f9ba8] hover:text-white"
            }`}
          >
            <Layers className={`w-3.5 h-3.5 ${activeView === "models" ? "text-white" : "text-purple-400"}`} />
            <span>Реєстр Моделей</span>
          </button>
          <button
            onClick={() => onChangeView("safety")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeView === "safety"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-[#8f9ba8] hover:text-white"
            }`}
          >
            <Shield className={`w-3.5 h-3.5 ${activeView === "safety" ? "text-white" : "text-emerald-400"}`} />
            <span>AI Safety</span>
          </button>
        </nav>

        {/* User / Actions */}
        <div className="flex items-center gap-2.5">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAdd}
                className="group flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-md shadow-indigo-600/25 active:scale-[0.98]"
              >
                <span>Створити</span>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
                  <Plus className="w-3 h-3" />
                </span>
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-white/10 text-xs">
                <span className="font-mono text-[#8f9ba8] hidden sm:inline">
                  @{currentUser.username}
                </span>
                <button
                  onClick={onLogout}
                  title="Вийти з акаунту"
                  className="p-1.5 rounded-full hover:bg-white/10 text-[#8f9ba8] hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="group flex items-center gap-2 pl-3.5 pr-2 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/10 transition-all active:scale-[0.98]"
            >
              <span>Увійти</span>
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <User className="w-3 h-3 text-[#f0f3f9]" />
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Submenu for small screens */}
      <div className="md:hidden flex items-center justify-center gap-1 mt-2 pointer-events-auto">
        <div className="glass-pill rounded-full px-3 py-1 flex items-center gap-1 text-[11px]">
          <button
            onClick={() => onChangeView("catalog")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${activeView === "catalog" ? "bg-indigo-600 text-white" : "text-[#8f9ba8]"}`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Каталог</span>
          </button>
          <button
            onClick={() => onChangeView("playground")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${activeView === "playground" ? "bg-indigo-600 text-white" : "text-[#8f9ba8]"}`}
          >
            <Cpu className="w-3 h-3" />
            <span>Playground</span>
          </button>
          <button
            onClick={() => onChangeView("models")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${activeView === "models" ? "bg-indigo-600 text-white" : "text-[#8f9ba8]"}`}
          >
            <Layers className="w-3 h-3" />
            <span>Моделі</span>
          </button>
          <button
            onClick={() => onChangeView("safety")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${activeView === "safety" ? "bg-indigo-600 text-white" : "text-[#8f9ba8]"}`}
          >
            <Shield className="w-3 h-3" />
            <span>Безпека</span>
          </button>
        </div>
      </div>
    </header>
  );
}
