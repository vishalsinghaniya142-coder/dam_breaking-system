import React from "react";
import {
  Settings as SettingsIcon,
  Globe,
  Eye,
  Volume2,
  VolumeX,
  Shield,
  MapPin,
  Bell,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { useEmergency } from "../context/EmergencyContext";
import { useLocation } from "../hooks/useLocation";
import { notificationService } from "../services/notificationService";

export function Settings() {
  const { currentLanguage, setLanguage, languages, activeLangObj } = useLanguage();
  const { highContrast, toggleHighContrast, largeText, toggleLargeText } = useTheme();
  const { speechSafetyMode, toggleSpeechSafetyMode, audioMuted, toggleAudio } = useEmergency();
  const { location, setManualLocation } = useLocation();

  const handleRequestNotifications = async () => {
    const perm = await notificationService.requestPermission();
    if (perm === "granted") {
      notificationService.sendNotification("PRAVAH Alert System Enabled", {
        body: "You will now receive desktop notifications for critical dam flood bulletins.",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-black text-white font-sans">
            System Preferences &amp; Accessibility Options
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure multilingual language support, voice accessibility modes, and location simulation.
        </p>
      </div>

      {/* Language Preference */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase font-mono">
          <Globe className="w-4 h-4" />
          <span>Multilingual Language Selection (12 Indian Languages)</span>
        </div>
        <p className="text-xs text-slate-400">
          All emergency announcements, AI responses, and navigation guidance will adapt to your chosen language.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`p-2.5 rounded-lg border text-xs text-left flex flex-col justify-between transition-all ${
                currentLanguage === lang.code
                  ? "bg-cyan-950 border-cyan-500 text-cyan-300 font-bold shadow-sm"
                  : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span className="text-sm font-sans">{lang.nativeName}</span>
              <span className="text-[10px] text-slate-500 font-mono mt-1">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accessibility & Voice Safety */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase font-mono">
          <Eye className="w-4 h-4" />
          <span>Inclusive Accessibility &amp; Voice-First Assist</span>
        </div>

        <div className="space-y-3">
          {/* Voice-First Emergency Mode */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-100 block">
                Voice Safety Mode for Visually Impaired
              </span>
              <span className="text-[11px] text-slate-400">
                Automatically reads aloud critical dam discharge warnings and evacuation directions using speech synthesis.
              </span>
            </div>
            <button
              onClick={toggleSpeechSafetyMode}
              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${
                speechSafetyMode
                  ? "bg-amber-500 text-slate-950 border-amber-400"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              {speechSafetyMode ? "ENABLED" : "DISABLED"}
            </button>
          </div>

          {/* High Contrast */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-100 block">
                High Contrast Display Mode
              </span>
              <span className="text-[11px] text-slate-400">
                Enhances border definition and contrast ratios for outdoor direct sunlight and low vision accessibility.
              </span>
            </div>
            <button
              onClick={toggleHighContrast}
              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${
                highContrast
                  ? "bg-amber-500 text-slate-950 border-amber-400"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              {highContrast ? "ENABLED" : "DISABLED"}
            </button>
          </div>

          {/* Large Text */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-100 block">
                Large Text Mode
              </span>
              <span className="text-[11px] text-slate-400">
                Increases baseline typography sizing across tables, cards, and telemetry gauges.
              </span>
            </div>
            <button
              onClick={toggleLargeText}
              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${
                largeText
                  ? "bg-amber-500 text-slate-950 border-amber-400"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              {largeText ? "ENABLED" : "DISABLED"}
            </button>
          </div>
        </div>
      </div>

      {/* Location Simulation for Testing */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase font-mono">
          <MapPin className="w-4 h-4" />
          <span>Geolocation Simulation &amp; River Basin Test Mode</span>
        </div>
        <p className="text-xs text-slate-400">
          Simulate being at different dam disaster perimeters to test real-time distance and evacuation calculations.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => setManualLocation(21.4669, 83.9812, "Sambalpur City Center (Hirakud Surge)")}
            className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200"
          >
            Hirakud Basin (Sambalpur, Odisha)
          </button>
          <button
            onClick={() => setManualLocation(30.0869, 78.2676, "Rishikesh Downstream (Tehri Dam)")}
            className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200"
          >
            Tehri Basin (Rishikesh, Uttarakhand)
          </button>
          <button
            onClick={() => setManualLocation(21.8315, 73.7483, "Kevadia Colony (Sardar Sarovar)")}
            className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200"
          >
            Narmada Basin (Kevadia, Gujarat)
          </button>
        </div>
      </div>

      {/* Push Notifications */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-100 block">
            Desktop Push Notifications
          </span>
          <span className="text-[11px] text-slate-400">
            Receive instant pop-up notifications when dams open spillway gates or flash flood sirens trigger.
          </span>
        </div>
        <button
          onClick={handleRequestNotifications}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold"
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Enable Notifications</span>
        </button>
      </div>
    </div>
  );
}

export default Settings;
