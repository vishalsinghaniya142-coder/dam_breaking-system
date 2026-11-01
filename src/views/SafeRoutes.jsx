import React from "react";
import { Route, Navigation, ShieldCheck, AlertTriangle, ArrowRight, Volume2 } from "lucide-react";
import { LiveLocationMap } from "../components/LiveLocationMap";
import { useLocation } from "../hooks/useLocation";
import { speakAlert } from "../utils/emergencyUtils";

export function SafeRoutes() {
  const { location, nearestShelter } = useLocation();

  const handleReadDirections = () => {
    speakAlert(
      `Evacuation guidance from your location to ${nearestShelter?.name || "the nearest shelter"}: Head East onto High Canal Road away from the river bank. Follow the green emergency signs for 1.8 kilometers toward the high ground elevation. Do not attempt to cross submerged culverts.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Route className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-black text-white font-sans">
              High-Ground Evacuation Corridors &amp; Hazard Routing
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time safe navigation routes designed to steer vehicles and pedestrians away from flash-flood river corridors.
          </p>
        </div>

        <button
          onClick={handleReadDirections}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
        >
          <Volume2 className="w-4 h-4 text-cyan-400" />
          <span>Voice Route Instructions</span>
        </button>
      </div>

      {/* Live Map of Route */}
      <LiveLocationMap height="450px" />

      {/* Turn by Turn Directions & Hazard warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-slate-100 uppercase font-mono tracking-wider">
              Primary Safe Highland Route to {nearestShelter?.name || "Relief Shelter"}
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              Elevation: +45m (Flood Resilient)
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              {
                step: "1",
                text: "Depart your current location and proceed Eastward away from the Mahanadi riverside embankment.",
                dist: "300 meters",
              },
              {
                step: "2",
                text: "Turn LEFT onto High Ridge Canal Bypass Road (NH-53 elevated viaduct). Do NOT use underpasses.",
                dist: "800 meters",
              },
              {
                step: "3",
                text: "Follow the green fluorescent NDRF disaster guidance signboards past the civil hospital.",
                dist: "500 meters",
              },
              {
                step: "4",
                text: "Arrive at Sambalpur High School Shelter main entrance. Check in with the district relief desk.",
                dist: "200 meters",
              },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {s.step}
                </span>
                <div className="flex-1">
                  <p className="text-slate-200">{s.text}</p>
                  <span className="text-[10px] text-slate-500 font-mono">{s.dist}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hazard Alert / Blocked Roads */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-red-500/30 bg-red-950/10 space-y-3">
          <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase font-mono">
            <AlertTriangle className="w-4 h-4" />
            <span>Hazard Alert: Blocked Corridors</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The following roads are strictly closed due to active flood spillway discharge:
          </p>

          <ul className="text-xs space-y-2 text-slate-300">
            <li className="p-2.5 rounded bg-slate-950 border border-red-900/50 text-red-200">
              <strong className="block text-red-400">Old Mahanadi Bridge Causeway:</strong>
              Submerged under 1.4m of turbulent water. Barricaded by traffic police.
            </li>
            <li className="p-2.5 rounded bg-slate-950 border border-red-900/50 text-red-200">
              <strong className="block text-red-400">Ring Road Railway Underpass:</strong>
              Waterlogged to 2.2m depth. Avoid entirely.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SafeRoutes;
