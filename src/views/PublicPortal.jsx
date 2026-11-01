import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Home,
  PhoneCall,
  Volume2,
  Navigation,
  Compass,
  ArrowRight,
  AlertTriangle,
  HeartPulse,
} from "lucide-react";
import { useLocation } from "../hooks/useLocation";
import { useEmergency } from "../context/EmergencyContext";
import { useLanguage } from "../context/LanguageContext";
import { LiveLocationMap } from "../components/LiveLocationMap";
import { speakAlert } from "../utils/emergencyUtils";

export function PublicPortal() {
  const { location, nearestDam, nearestShelter, loading } = useLocation();
  const { criticalAlertsCount } = useEmergency();
  const { t, activeLangObj } = useLanguage();

  const isCriticalZone = nearestDam && nearestDam.riskLevel === "CRITICAL";

  const handleReadSafetyAdvice = () => {
    speakAlert(
      "Public Safety Advisory: You are located near " +
        (location.name || "the river basin") +
        ". Hirakud Dam is discharging flood water. If you are in a low-lying riverside area, move immediately to " +
        (nearestShelter?.name || "the nearest high ground shelter") +
        ". Follow the green designated routes. Call 112 for rescue.",
      activeLangObj?.speechCode || "en-IN"
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Hero "Am I in Danger?" Status Card */}
      <div
        className={`p-6 rounded-2xl border shadow-2xl transition-all ${
          isCriticalZone
            ? "bg-gradient-to-br from-red-950/80 via-slate-900 to-slate-950 border-red-500/60 shadow-red-950/40"
            : "bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border-cyan-500/40 shadow-cyan-950/30"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                isCriticalZone
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              }`}
            >
              {isCriticalZone ? (
                <ShieldAlert className="w-7 h-7" />
              ) : (
                <ShieldCheck className="w-7 h-7" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
                Local Proximity Safety Assessment
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {isCriticalZone ? "Flood Surge Warning in Effect" : "Monitoring Normal Inflow"}
              </h1>
            </div>
          </div>

          <button
            onClick={handleReadSafetyAdvice}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold rounded-xl border border-slate-700 shadow-sm"
          >
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>Read Aloud in {activeLangObj.name}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px]">Your Monitored River Basin:</span>
            <p className="font-bold text-slate-100 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{location.name || "Live GPS Location"}</span>
            </p>
            {nearestDam && (
              <p className="text-[11px] text-slate-400 font-mono">
                Nearest: <strong className="text-white">{nearestDam.name}</strong> ({nearestDam.riskLevel})
              </p>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px]">Assigned High-Ground Shelter:</span>
            <p className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5" />
              <span>{nearestShelter?.name || "Govt High School Shelter"}</span>
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              Elevation: +{nearestShelter?.elevationMeters || 45}m &bull; {nearestShelter?.distanceKm || 1.8} km away
            </p>
          </div>
        </div>

        {/* SOS One-Tap Buttons */}
        <div className="pt-4 mt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <a
            href="tel:112"
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-black text-sm rounded-xl shadow-lg shadow-red-950 transition-colors"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>SOS &bull; Dial 112</span>
          </a>

          <a
            href="tel:1078"
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm rounded-xl shadow-lg transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span>NDRF Hotline 1078</span>
          </a>

          <Link
            to="/safe-routes"
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-sm rounded-xl border border-slate-700 transition-colors"
          >
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span>Directions to Shelter</span>
          </Link>
        </div>
      </div>

      {/* Live Map with Safe Evacuation Path */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
          Safe Evacuation Corridor to Nearest High-Ground Shelter
        </h2>
        <LiveLocationMap height="360px" />
      </div>

      {/* Offline Survival Instructions */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Dam Flood Safety Protocol &bull; NDMA Guidelines</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="font-bold text-cyan-400 font-mono block uppercase">
              1. Before / Alert Issued
            </span>
            <ul className="text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>Keep phone fully charged and pack emergency bag with medicines, IDs, and drinking water.</li>
              <li>Untie livestock and move pets to high ground.</li>
              <li>Monitor official alerts on PRAVAH or state radio.</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="font-bold text-amber-400 font-mono block uppercase">
              2. During Spillway Surge
            </span>
            <ul className="text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>Move to higher ground immediately (at least 30m above river level).</li>
              <li>Never drive or walk across flooded bridges or causeways. Just 15cm of moving water can knock you down.</li>
              <li>Turn off main electrical breaker and LPG gas cylinder before leaving.</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="font-bold text-emerald-400 font-mono block uppercase">
              3. At Relief Center
            </span>
            <ul className="text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>Register yourself with the district camp coordinator.</li>
              <li>Drink only boiled or halogen-purified drinking water provided at camp.</li>
              <li>Do not return home until the Central Water Commission issues an 'All Clear' notification.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicPortal;
