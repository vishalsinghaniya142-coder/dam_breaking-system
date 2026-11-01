import React from "react";
import { Sparkles, MessageSquare } from "lucide-react";
import { useEmergency } from "../context/EmergencyContext";

export function FloatingAIButton({ onClick, isOpen }) {
  const { emergencyModeActive, criticalAlertsCount } = useEmergency();

  return (
    <div className="fixed top-20 right-5 z-40 flex items-center group">
      {/* Tooltip on hover */}
      <div className="mr-3 px-2.5 py-1 rounded-md bg-slate-900/90 text-cyan-300 text-xs font-semibold border border-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg whitespace-nowrap hidden sm:block">
        PRAVAH AI Flood Companion
      </div>

      <button
        onClick={onClick}
        aria-label="Open PRAVAH AI Assistant"
        className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
          isOpen
            ? "bg-cyan-500 text-slate-950 ring-4 ring-cyan-400/50 rotate-90"
            : emergencyModeActive || criticalAlertsCount > 0
            ? "bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 text-white ring-4 ring-red-500/50 animate-pulse shadow-red-900/50"
            : "bg-gradient-to-tr from-cyan-500 via-sky-600 to-blue-700 text-white ring-4 ring-cyan-500/30 hover:ring-cyan-400/60 shadow-cyan-950/60 hover:scale-105"
        }`}
      >
        <Sparkles className="w-6 h-6 animate-pulse" />

        {/* Pulsing indicator ring for active emergency */}
        {(emergencyModeActive || criticalAlertsCount > 0) && (
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
