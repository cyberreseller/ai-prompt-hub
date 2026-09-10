"use client";

import React from "react";
import { CheckCircle2, Sparkles, AlertTriangle, X } from "lucide-react";

export interface ToastProps {
  message: string;
  type?: "success" | "info" | "warning";
  onClose: () => void;
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0d111a]/95 border border-white/15 backdrop-blur-xl shadow-2xl text-xs text-white transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
      {type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
      {type === "info" && <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />}
      {type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
      <span className="font-medium tracking-wide">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
