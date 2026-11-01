import React from "react";
import { Bot } from "lucide-react";
import { useEmergency } from "../context/EmergencyContext";

export function FloatingAIButton({ onClick, isOpen }) {
  const { emergencyModeActive, criticalAlertsCount } = useEmergency();
  const hasCriticalAlert = emergencyModeActive || criticalAlertsCount > 0;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center group sm:bottom-6 sm:right-6">
      {/* Tooltip on hover */}
      <div className="mr-3 px-2.5 py-1 rounded-md bg-slate-900/95 text-emerald-300 text-xs font-semibold border border-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg whitespace-nowrap hidden sm:block">
        PRALAY AI Flood Companion
      </div>

      <button
        onClick={onClick}
        aria-label="Open PRALAY AI Assistant"
        aria-expanded={isOpen}
        className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
          isOpen
            ? "bg-emerald-300 text-emerald-950 ring-4 ring-emerald-400/40"
            : "bg-gradient-to-br from-emerald-400 via-green-500 to-green-700 text-white ring-4 ring-emerald-500/25 hover:ring-emerald-400/50 shadow-emerald-950/60 hover:scale-105"
        }`}
      >
        <span className="absolute inset-1 rounded-[14px] border border-white/20" />
        <Bot className="relative w-7 h-7" strokeWidth={2.2} />

        {/* Pulsing indicator ring for active emergency */}
        {hasCriticalAlert && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 border border-white text-[9px] font-bold text-white items-center justify-center">
              !
            </span>
          </span>
        )}
      </button>
    </div>
  );
}

export default FloatingAIButton;
