import React from "react";
import { Link } from "react-router-dom";
import { Activity, Gauge, ArrowDownRight, ArrowUpRight, ShieldCheck, AlertTriangle, ExternalLink } from "lucide-react";
import { getRiskColorClass } from "../utils/helpers";

export function DamHealthCard({ dam }) {
  const isCritical = dam.riskLevel === "CRITICAL";
  const isHigh = dam.riskLevel === "HIGH";

  return (
    <div
      className={`p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border transition-all duration-200 shadow-md ${
        isCritical
          ? "border-red-500/50 hover:border-red-400 shadow-red-950/30"
          : isHigh
          ? "border-orange-500/40 hover:border-orange-400"
          : "border-slate-800 hover:border-cyan-500/40"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-100">{dam.name}</h4>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${getRiskColorClass(dam.riskLevel)}`}>
              {dam.riskLevel}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {dam.river} &bull; {dam.state}
          </p>
        </div>

        <Link
          to={`/dam/${dam.id}`}
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
          title="View detailed telemetry"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Storage Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs font-mono mb-1">
          <span className="text-slate-400">Reservoir Storage</span>
          <span className="font-bold text-slate-200">{dam.storagePercentage}%</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              dam.storagePercentage >= 90
                ? "bg-red-500"
                : dam.storagePercentage >= 80
                ? "bg-amber-500"
                : "bg-cyan-500"
            }`}
            style={{ width: `${Math.min(100, dam.storagePercentage)}%` }}
          />
        </div>
      </div>

      {/* Hydrological Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Water Level</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-bold text-slate-100 font-mono text-sm">{dam.currentWaterLevel}m</span>
            <span className="text-[10px] text-slate-500">/ {dam.dangerLevel}m</span>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Gates Open</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-bold text-cyan-400 font-mono text-sm">{dam.gatesOpen}</span>
            <span className="text-[10px] text-slate-500">of {dam.totalGates}</span>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Inflow</span>
            <span className="font-bold text-blue-400 font-mono text-xs">{dam.inflow} m³/s</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-blue-400" />
        </div>

        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Discharge</span>
            <span className="font-bold text-orange-400 font-mono text-xs">{dam.outflow} m³/s</span>
          </div>
          <ArrowDownRight className="w-4 h-4 text-orange-400" />
        </div>
      </div>

      {/* Structural Health */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="truncate max-w-[170px]">{dam.structuralHealth}</span>
        </div>
        <span className="text-slate-500 font-mono text-[10px]">CWC Code: {dam.cwcCode}</span>
      </div>
    </div>
  );
}

export default DamHealthCard;
