import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Siren, ShieldAlert, Volume2, VolumeX, ArrowRight } from "lucide-react";
import { useEmergency } from "../context/EmergencyContext";
import { useLanguage } from "../context/LanguageContext";

export function EmergencyBanner() {
  const {
    emergencyModeActive,
    toggleEmergencyMode,
    criticalAlertsCount,
    audioMuted,
    toggleAudio,
    speechSafetyMode,
    toggleSpeechSafetyMode,
  } = useEmergency();
  const { t } = useLanguage();

  if (!emergencyModeActive && criticalAlertsCount === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-950 via-red-900 to-rose-950 text-red-100 border-b border-red-500/40 px-4 py-2.5 shadow-lg shadow-red-950/40 relative z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-full bg-red-600/30 text-red-300 ring-2 ring-red-500/60 animate-pulse">
            <Siren className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-black tracking-widest uppercase bg-red-600 text-white rounded font-mono">
                {t("dangerAlert")}
              </span>
              <span className="text-xs text-red-200 font-medium">
                {criticalAlertsCount} Critical Dam Spillway / Flood Bulletins Active
              </span>
            </div>
            <p className="text-xs text-red-100/90 hidden sm:block mt-0.5">
              High inundation risk detected in Hirakud &amp; Tehri downstream basins. All response units on Code Red.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSpeechSafetyMode}
            className={`px-2.5 py-1 text-xs font-semibold rounded border transition-colors flex items-center gap-1.5 ${
              speechSafetyMode
                ? "bg-amber-500 text-slate-950 border-amber-400 font-bold"
                : "bg-red-900/60 text-red-200 border-red-700/50 hover:bg-red-800/60"
            }`}
            title="Voice Safety Mode for Visually Impaired"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Voice Safety {speechSafetyMode ? "ON" : "OFF"}</span>
          </button>

          <button
            onClick={toggleAudio}
            className="p-1.5 rounded border border-red-700/60 bg-red-900/60 hover:bg-red-800 text-red-200 text-xs"
            title={audioMuted ? "Unmute Alerts" : "Mute Siren"}
          >
            {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />}
          </button>

          <Link
            to="/emergency-response"
            className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded transition-colors flex items-center gap-1 shadow-sm"
          >
            <span>{t("emergencyResponse")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EmergencyBanner;
