import React, { useState } from "react";
import {
  Cpu,
  Play,
  RotateCcw,
  Sliders,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Zap,
  Activity,
} from "lucide-react";
import { DAMS_DATA } from "../data/damData";
import { floodPredictionService } from "../services/floodPredictionService";
import { MOCK_SIMULATION_DATA } from "../data/mockSimulationData";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export function FloodPrediction() {
  const [selectedDam, setSelectedDam] = useState(DAMS_DATA[1]); // Hirakud
  const [breachWidth, setBreachWidth] = useState(120);
  const [rainfallIntensity, setRainfallIntensity] = useState(115);
  const [overtoppingHeight, setOvertoppingHeight] = useState(1.8);
  const [simResults, setSimResults] = useState(() =>
    floodPredictionService.runCustomSimulation({
      dam: DAMS_DATA[1],
      breachWidth: 120,
      rainfallIntensity: 115,
      overtoppingHeight: 1.8,
    })
  );
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const results = floodPredictionService.runCustomSimulation({
        dam: selectedDam,
        breachWidth,
        rainfallIntensity,
        overtoppingHeight,
      });
      setSimResults(results);
      setIsSimulating(false);
    }, 450);
  };

  const handleReset = () => {
    setBreachWidth(100);
    setRainfallIntensity(80);
    setOvertoppingHeight(1.0);
    const results = floodPredictionService.runCustomSimulation({
      dam: selectedDam,
      breachWidth: 100,
      rainfallIntensity: 80,
      overtoppingHeight: 1.0,
    });
    setSimResults(results);
  };

  // Generate hydrograph for simulation results
  const simHydrograph = [
    { hour: "0h", discharge: selectedDam.outflow },
    { hour: "1h", discharge: Math.round(selectedDam.outflow * 1.5) },
    { hour: "2h", discharge: Math.round(simResults.peakDischarge * 0.4) },
    { hour: "3h (Peak)", discharge: simResults.peakDischarge },
    { hour: "4h", discharge: Math.round(simResults.peakDischarge * 0.78) },
    { hour: "5h", discharge: Math.round(simResults.peakDischarge * 0.52) },
    { hour: "6h", discharge: Math.round(simResults.peakDischarge * 0.35) },
    { hour: "8h", discharge: Math.round(simResults.peakDischarge * 0.22) },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-black text-white font-sans">
              AI Dam Breach &amp; Inundation Simulation Engine
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Physics-based Froehlich breach hydraulics combined with Delft3D hydrodynamic wave propagation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-cyan-950 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isSimulating ? "Simulating Physics..." : "Execute Simulation"}</span>
          </button>
        </div>
      </div>

      {/* Control Sliders & Physics Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-100 uppercase font-mono tracking-wider">
              Simulation Variables
            </h3>
          </div>

          {/* Dam Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Target Dam Reservoir
            </label>
            <select
              value={selectedDam.id}
              onChange={(e) => {
                const found = DAMS_DATA.find((d) => d.id === e.target.value);
                if (found) setSelectedDam(found);
              }}
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
            >
              {DAMS_DATA.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.state}) - {d.storagePercentage}% Full
                </option>
              ))}
            </select>
          </div>

          {/* Breach Width Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Simulated Breach Width:</span>
              <span className="text-cyan-400 font-bold">{breachWidth} meters</span>
            </div>
            <input
              type="range"
              min={30}
              max={300}
              step={10}
              value={breachWidth}
              onChange={(e) => setBreachWidth(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              Earthen embankment structural fissure or concrete monolith failure span.
            </p>
          </div>

          {/* Catchment Rainfall Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Catchment Rainfall (12h):</span>
              <span className="text-blue-400 font-bold">{rainfallIntensity} mm</span>
            </div>
            <input
              type="range"
              min={20}
              max={250}
              step={5}
              value={rainfallIntensity}
              onChange={(e) => setRainfallIntensity(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              Extreme cloudburst rainfall over the reservoir drainage catchment basin.
            </p>
          </div>

          {/* Overtopping Height */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Crest Overtopping Height:</span>
              <span className="text-amber-400 font-bold">{overtoppingHeight} meters</span>
            </div>
            <input
              type="range"
              min={0}
              max={4}
              step={0.2}
              value={overtoppingHeight}
              onChange={(e) => setOvertoppingHeight(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              Water head crest elevation exceeding maximum dam parapet wall.
            </p>
          </div>
        </div>

        {/* Output Metrics (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Peak Discharge</span>
              <p className="text-xl font-black text-red-400 font-mono mt-1">
                {simResults.peakDischarge.toLocaleString()}{" "}
                <span className="text-xs font-normal text-slate-400">m³/s</span>
              </p>
              <span className="text-[10px] text-slate-500">Froehlich Q_peak</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Time to Peak</span>
              <p className="text-xl font-black text-amber-400 font-mono mt-1">
                {simResults.timeToPeakHours}{" "}
                <span className="text-xs font-normal text-slate-400">Hours</span>
              </p>
              <span className="text-[10px] text-slate-500">Breach culmination</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Inundation Area</span>
              <p className="text-xl font-black text-cyan-400 font-mono mt-1">
                {simResults.inundationAreaKm2}{" "}
                <span className="text-xs font-normal text-slate-400">km²</span>
              </p>
              <span className="text-[10px] text-slate-500">Downstream submersion</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">First Town Arrival</span>
              <p className="text-xl font-black text-orange-400 font-mono mt-1">
                {simResults.firstSettlementArrivalTimeHours}{" "}
                <span className="text-xs font-normal text-slate-400">Hours</span>
              </p>
              <span className="text-[10px] text-slate-500">Wave travel window</span>
            </div>
          </div>

          {/* Hydrograph Chart */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider mb-2">
              Breach Outflow Wave Hydrograph (Delft3D Model)
            </h4>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simHydrograph}>
                  <defs>
                    <linearGradient id="breachGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} unit=" m³/s" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.5rem",
                      fontSize: "0.75rem",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="discharge"
                    name="Breach Discharge (cumecs)"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    fill="url(#breachGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Downstream District Wave Arrival Table */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
        <h3 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider mb-3">
          Downstream Population Settlement Flood Wave Arrival Timeline
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="pb-2">Settlement / Ward</th>
                <th className="pb-2">River Distance</th>
                <th className="pb-2">Flood Wave Arrival</th>
                <th className="pb-2">Est Peak Depth</th>
                <th className="pb-2">Population at Risk</th>
                <th className="pb-2">Evacuation Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {MOCK_SIMULATION_DATA.arrivalTimes.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-2.5 font-bold text-white font-sans">{item.district}</td>
                  <td className="py-2.5">{item.distanceKm} km</td>
                  <td className="py-2.5 text-amber-400 font-bold">{item.arrivalTimeHours} hours</td>
                  <td className="py-2.5 text-red-400">{item.peakDepthMeters} meters</td>
                  <td className="py-2.5">
  {(item.populationAtRisk ?? 0).toLocaleString()} citizens
</td>
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.evacuationPriority === "CRITICAL"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                      }`}
                    >
                      {item.evacuationPriority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FloodPrediction;
