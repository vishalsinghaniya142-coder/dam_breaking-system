import React, { useState } from "react";
import {
  Siren,
  PhoneCall,
  ShieldAlert,
  Users,
  CheckSquare,
  Truck,
  Volume2,
  AlertTriangle,
  Radio,
  Clock,
} from "lucide-react";
import { useEmergency } from "../context/EmergencyContext";
import { speakAlert, playEmergencyAlertSound } from "../utils/emergencyUtils";

export function EmergencyResponse() {
  const { emergencyModeActive, toggleEmergencyMode, speechSafetyMode, toggleSpeechSafetyMode } = useEmergency();

  const [checklist, setChecklist] = useState([
    { id: 1, text: "Sound riverside siren beacons across Sambalpur & Burla wards", done: true },
    { id: 2, text: "Deploy NDRF 3rd Battalion motorized rescue zodiacs to Low-lying Ward 4", done: true },
    { id: 3, text: "Cut electrical grid feeders to inundated sub-stations to prevent electrocution", done: true },
    { id: 4, text: "Dispatch 24 state transport evacuation buses along NH-53 high ground", done: false },
    { id: 5, text: "Open GM University & Govt High School relief centers with hot meal supplies", done: true },
    { id: 6, text: "Issue radio broadcast in Odia, Hindi, and English every 15 minutes", done: false },
  ]);

  const toggleCheck = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleTestSiren = () => {
    playEmergencyAlertSound();
    speakAlert("Attention: This is an official emergency alert. High water release detected. Proceed to safe high ground shelters.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Siren className="w-5 h-5 text-red-500 animate-pulse" />
            <h1 className="text-xl font-black text-white font-sans">
              Incident Command &amp; Emergency Evacuation Operations
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Inter-agency rescue coordination, NDRF/SDRF tactical deployments, and shelter logistics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestSiren}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Test Voice Announcement</span>
          </button>

          <button
            onClick={toggleEmergencyMode}
            className={`flex items-center gap-1.5 px-4 py-2 font-bold text-xs rounded-lg shadow-lg transition-all ${
              emergencyModeActive
                ? "bg-red-600 hover:bg-red-500 text-white ring-4 ring-red-500/40 animate-pulse"
                : "bg-red-950 border border-red-700 text-red-300 hover:bg-red-900"
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>{emergencyModeActive ? "CODE RED ENGAGED" : "ENGAGE CODE RED"}</span>
          </button>
        </div>
      </div>

      {/* Emergency Hotlines Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <a
          href="tel:112"
          className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 hover:bg-red-900/40 transition-colors flex items-center justify-between group"
        >
          <div>
            <span className="text-[10px] font-mono text-red-400 uppercase font-bold block">National Emergency</span>
            <span className="text-xl font-black text-white font-mono">112</span>
          </div>
          <PhoneCall className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
        </a>

        <a
          href="tel:1078"
          className="p-3.5 rounded-xl bg-orange-950/40 border border-orange-500/40 hover:bg-orange-900/40 transition-colors flex items-center justify-between group"
        >
          <div>
            <span className="text-[10px] font-mono text-orange-400 uppercase font-bold block">NDRF Disaster Control</span>
            <span className="text-xl font-black text-white font-mono">1078</span>
          </div>
          <PhoneCall className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
        </a>

        <a
          href="tel:1070"
          className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 hover:bg-amber-900/40 transition-colors flex items-center justify-between group"
        >
          <div>
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">State Disaster (SDRF)</span>
            <span className="text-xl font-black text-white font-mono">1070</span>
          </div>
          <PhoneCall className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
        </a>

        <a
          href="tel:1077"
          className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 hover:bg-cyan-900/40 transition-colors flex items-center justify-between group"
        >
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">District Collectorate</span>
            <span className="text-xl font-black text-white font-mono">1077</span>
          </div>
          <PhoneCall className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
        </a>
      </div>

      {/* Deployment & Tactical Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deployed Units (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-slate-100 uppercase font-mono tracking-wider">
              Disaster Response Units Active in Field
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-bold">14 Teams Deployed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                unit: "NDRF 3rd Battalion (Team Delta)",
                location: "Sambalpur Riverbank Wards",
                strength: "45 Rescuers &bull; 8 Zodiac Inflatables",
                status: "ACTIVE_SEARCH_RESCUE",
              },
              {
                unit: "Odisha Disaster Rapid Action Force (ODRAF)",
                location: "Burla Downstream Lowland",
                strength: "32 Personnel &bull; Tree Cutting Equipment",
                status: "CLEARING_EVAC_ROUTE",
              },
              {
                unit: "Indian Army Engineering Task Force",
                location: "Chiplima Power House Bridge",
                strength: "60 Sapper Engineers &bull; Bailey Bridge Kit",
                status: "FORTIFYING_APPROACH",
              },
              {
                unit: "State Fire & Emergency Services",
                location: "Khetrajpur Bus Terminal",
                strength: "28 Officers &bull; 4 Heavy Pumping Units",
                status: "URBAN_DEWATERING",
              },
            ].map((u, i) => (
              <div key={i} className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-slate-200">{u.unit}</h4>
                  <span className="shrink-0 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {u.status}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] font-mono">{u.location}</p>
                <p className="text-slate-500 text-[10px]">{u.strength}</p>
              </div>
            ))}
          </div>

          {/* Ward Evacuation Progress */}
          <div className="pt-3 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 font-mono uppercase mb-2">
              Low-Lying Urban Ward Evacuation Quota
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="text-slate-300">Ward 3 &amp; 4 (Mandalia Riverbank)</span>
                  <span className="text-cyan-400 font-bold">78% Complete (3,420 citizens relocated)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: "78%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="text-slate-300">Ward 7 (Khetrajpur Railway Colony)</span>
                  <span className="text-amber-400 font-bold">54% Complete (2,180 citizens relocated)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "54%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Command Checklist */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <h3 className="text-xs font-bold text-slate-100 uppercase font-mono tracking-wider">
                NDMA Standard Operating Checklist
              </h3>
              <CheckSquare className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="space-y-2.5">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer select-none hover:text-slate-100"
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleCheck(item.id)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <span className={item.done ? "line-through text-slate-500" : ""}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4 text-[10px] text-slate-500 font-mono">
            Complies with National Disaster Management Plan Section 6.4 (Flood Mitigation).
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmergencyResponse;
