import React, { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Activity,
  Search,
  Filter,
  SlidersHorizontal,
  ExternalLink,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { DAMS_DATA } from "../data/damData";
import { getRiskColorClass } from "../utils/helpers";
import { DamHealthCard } from "../components/DamHealthCard";
import { useAuth } from "../context/AuthContext";
import { USER_ROLES } from "../utils/constants";

export function DamMonitoring() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedRisk, setSelectedRisk] = useState("ALL");
  const [selectedState, setSelectedState] = useState("ALL");
  const { currentUser } = useAuth();

  const statesList = useMemo(() => {
    return Array.from(new Set(DAMS_DATA.map((d) => d.state)));
  }, []);

  const filteredDams = useMemo(() => {
    return DAMS_DATA.filter((dam) => {
      const matchesSearch =
        dam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dam.river.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dam.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dam.cwcCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRisk =
        selectedRisk === "ALL" || dam.riskLevel === selectedRisk;

      const matchesState =
        selectedState === "ALL" || dam.state === selectedState;

      return matchesSearch && matchesRisk && matchesState;
    });
  }, [searchQuery, selectedRisk, selectedState]);

  const canManage =
    currentUser?.role === USER_ROLES.ADMIN ||
    currentUser?.role === USER_ROLES.GOVT_OFFICIAL;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-black tracking-tight text-white font-sans">
              National Dam Hydrological Monitoring Fleet
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry, spillway gate aperture, structural piezometers, and CWC rule curve compliance.
          </p>
        </div>

        {canManage && (
          <Link
            to="/manage-dams"
            className="flex items-center gap-1.5 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Dam Telemetry</span>
          </Link>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by dam name, river basin, state, or CWC code..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical Danger (Red)</option>
            <option value="HIGH">High Alert (Orange)</option>
            <option value="MODERATE">Moderate Watch (Amber)</option>
            <option value="NORMAL">Normal Safe (Green)</option>
          </select>
        </div>

        <div>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All States (National)</option>
            {statesList.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
        <span>
          Showing {filteredDams.length} of {DAMS_DATA.length} monitored reservoirs
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Critical: {DAMS_DATA.filter((d) => d.riskLevel === "CRITICAL").length}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>High: {DAMS_DATA.filter((d) => d.riskLevel === "HIGH").length}</span>
          </span>
        </div>
      </div>

      {/* Grid of Dam Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDams.map((dam) => (
          <DamHealthCard key={dam.id} dam={dam} />
        ))}
      </div>

      {filteredDams.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
          <p className="text-sm font-semibold text-slate-300">No reservoirs match your filter criteria</p>
          <p className="text-xs text-slate-500">Try resetting the search query or selecting "All States".</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedRisk("ALL");
              setSelectedState("ALL");
            }}
            className="px-3 py-1.5 text-xs text-cyan-400 bg-cyan-950 border border-cyan-800 rounded-lg mt-2"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default DamMonitoring;
