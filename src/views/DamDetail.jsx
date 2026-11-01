import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  ShieldAlert,
  Sliders,
  Cpu,
  Waves,
  Clock,
  Gauge,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
} from "lucide-react";
import { DAMS_DATA } from "../data/damData";
import { damService } from "../services/damService";
import { geminiService } from "../services/geminiService";
import { WaterLevelChart } from "../components/WaterLevelChart";
import { FloodMap } from "../components/FloodMap";
import { getRiskColorClass } from "../utils/helpers";

export function DamDetail() {
  const { id } = useParams();
  const [dam, setDam] = useState(null);
  const [hydroData, setHydroData] = useState([]);
  const [aiReport, setAiReport] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [activeGates, setActiveGates] = useState(24);

  useEffect(() => {
    const found = DAMS_DATA.find((d) => d.id === id) || DAMS_DATA[0];
    setDam(found);
    setActiveGates(found.gatesOpen);
    const trend = damService.getWaterLevelTrend(found.id, 24);
    setHydroData(trend);
  }, [id]);

  if (!dam) return null;

  const handleGenerateAiReport = async () => {
    setIsGeneratingAi(true);
    try {
      const report = await geminiService.analyzeRisk(dam, {}, {});
      setAiReport(report);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back and Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <Link
            to="/dam-monitoring"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 font-medium mb-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dam Fleet</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white font-sans">{dam.name}</h1>
            <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase ${getRiskColorClass(dam.riskLevel)}`}>
              {dam.riskLevel}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {dam.river} Basin &bull; {dam.state}, India &bull; CWC Code: <span className="font-mono text-cyan-400">{dam.cwcCode}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateAiReport}
            disabled={isGeneratingAi}
            className="flex items-center gap-1.5 px-3 py-2 bg-cyan-950 border border-cyan-500/50 hover:bg-cyan-900/60 text-cyan-300 text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isGeneratingAi ? "Computing AI Hydro Report..." : "AI Safety Audit"}</span>
          </button>

          <Link
            to={`/flood-prediction`}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg shadow-md transition-colors"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Simulate Breach</span>
          </Link>
        </div>
      </div>

      {/* AI Hydrological Audit Banner if generated */}
      {aiReport && (
        <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/40 text-xs text-slate-200 shadow-xl space-y-2 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono">
            <Sparkles className="w-4 h-4" />
            <span>GEMINI HYDRAULIC VULNERABILITY ANALYSIS</span>
          </div>
          <p className="whitespace-pre-wrap leading-relaxed text-slate-300 font-sans">
            {aiReport}
          </p>
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Current Water Level</span>
          <p className="text-xl font-black text-slate-100 mt-1 font-mono">
            {dam.currentWaterLevel} <span className="text-xs font-normal text-slate-400">m</span>
          </p>
          <span className="text-[11px] text-red-400 font-mono">
            Danger Mark: {dam.dangerLevel}m ({Math.round((dam.dangerLevel - dam.currentWaterLevel) * 100) / 100}m buffer)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Storage Utilization</span>
          <p className="text-xl font-black text-amber-400 mt-1 font-mono">
            {dam.storagePercentage}%
          </p>
          <span className="text-[11px] text-slate-400">
            Capacity: {dam.capacity} MCM
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Inflow Runoff</span>
          <p className="text-xl font-black text-blue-400 mt-1 font-mono">
            {dam.inflow} <span className="text-xs font-normal text-slate-400">cumecs</span>
          </p>
          <span className="text-[11px] text-slate-400">
            Catchment rate rising
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Spillway Discharge</span>
          <p className="text-xl font-black text-orange-400 mt-1 font-mono">
            {dam.outflow} <span className="text-xs font-normal text-slate-400">cumecs</span>
          </p>
          <span className="text-[11px] text-cyan-400 font-mono">
            {activeGates} of {dam.totalGates} sluice gates open
          </span>
        </div>
      </div>

      {/* Hydrograph Chart & Sluice Gate Control */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
              Inflow vs Outflow Hydrograph (24 Hours)
            </h3>
            <span className="text-xs text-slate-400 font-mono">Hourly CWC Log</span>
          </div>
          <WaterLevelChart data={hydroData} dam={dam} />
        </div>

        {/* Spillway Gate Aperture Control (For Authorized Engineers) */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
              Sluice Gate Aperture
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Spillway rule curve discharge regulation for {dam.name}.
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Open Spillway Gates:</span>
              <span className="text-cyan-400 font-bold">{activeGates} / {dam.totalGates}</span>
            </div>
            <input
              type="range"
              min={0}
              max={dam.totalGates}
              value={activeGates}
              onChange={(e) => setActiveGates(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Gate Discharge Est:</span>
              <span className="text-white font-bold">{Math.round(activeGates * (dam.outflow / Math.max(1, dam.gatesOpen)))} cumecs</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Rule Curve Safe Limit:</span>
              <span className="text-emerald-400 font-bold">4,200 cumecs</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              Structural Telemetry Sensors:
            </span>
            <ul className="text-xs text-slate-300 space-y-1">
              <li className="flex items-center justify-between">
                <span>Crest Piezometer Pore Pressure:</span>
                <span className="text-emerald-400 font-mono">0.38 MPa (Normal)</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Foundation Seepage Rate:</span>
                <span className="text-amber-400 font-mono">14.2 L/min (Elevated)</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Seismic Accelerometer:</span>
                <span className="text-emerald-400 font-mono">0.012g (Quiet)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Basin Location Map */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
          Basin Topography &amp; Downstream Spillway Channel
        </h3>
        <FloodMap selectedDam={dam} center={[dam.lat, dam.lng]} zoom={10} height="360px" />
      </div>
    </div>
  );
}

export default DamDetail;
