import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Users,
  MapPin,
  Phone,
  ShieldCheck,
  Zap,
  Droplets,
  HeartPulse,
  Navigation,
} from "lucide-react";
import { MOCK_SHELTERS } from "../data/mockSimulationData";

export function Shelters() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-black text-white font-sans">
              Designated Emergency Relief Shelters &amp; High-Ground Centers
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified flood-resilient relief centers equipped with emergency power, water purification, and medical staff.
          </p>
        </div>

        <Link
          to="/safe-routes"
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>View Safe Evacuation Routes</span>
        </Link>
      </div>

      {/* Shelters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_SHELTERS.map((shelter) => {
          const occupancyRate = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
          return (
            <div
              key={shelter.id}
              className="p-5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-emerald-500/40 transition-all shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-slate-100">{shelter.name}</h3>
                  <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {shelter.status}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Elevation: +{shelter.elevationMeters}m High Ground</span>
                </div>

                {/* Occupancy bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Current Occupancy:</span>
                    <span className="text-slate-200 font-bold">
                      {shelter.currentOccupancy} / {shelter.capacity} ({occupancyRate}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        occupancyRate >= 80 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                </div>

                {/* Facilities Badges */}
                <div className="mb-4">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1.5">
                    Available Facilities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {shelter.facilities.map((fac, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-slate-300 font-mono"
                      >
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer contact and directions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <a
                  href={`tel:${shelter.contact}`}
                  className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 font-mono"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{shelter.contact}</span>
                </a>

                <Link
                  to="/safe-routes"
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium border border-slate-700"
                >
                  Get Route
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Shelters;
