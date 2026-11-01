import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  Activity,
  AlertOctagon,
  Cpu,
  Waves,
  CloudRain,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useEmergency } from "../context/EmergencyContext";
import { damService } from "../services/damService";
import { DAMS_DATA } from "../data/damData";
import { StatCard } from "../components/StatCard";
import { AlertCard } from "../components/AlertCard";
import { WeatherWidget } from "../components/WeatherWidget";
import { WaterLevelChart } from "../components/WaterLevelChart";
import { DamHealthCard } from "../components/DamHealthCard";
import { FloodMap } from "../components/FloodMap";

export function Dashboard() {
  const { t } = useLanguage();
  const { alerts, activeAlertsCount, criticalAlertsCount, acknowledgeAlert } = useEmergency();
  const [selectedDam, setSelectedDam] = useState(DAMS_DATA[1]); // Default to Hirakud (Critical)
  const [hydroData, setHydroData] = useState([]);

  useEffect(() => {
    if (selectedDam) {
      const trend = damService.getWaterLevelTrend(selectedDam.id, 24);
      setHydroData(trend);
    }
  }, [selectedDam]);

  const criticalDams = DAMS_DATA.filter((d) => d.riskLevel === "CRITICAL" || d.riskLevel === "HIGH");
  const avgStorage = Math.round(
    DAMS_DATA.reduce((acc, d) => acc + d.storagePercentage, 0) / DAMS_DATA.length
  );

  return (
    <div className="space-y-6">
      {/* Page Header with Quick Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white font-sans">
              National Dam Flood Intelligence Command
            </h1>
            <span className="px-2 py-0.5 text-xs font-mono font-bold rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              LIVE CWC TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time hydrodynamic monitoring, AI breach prediction, and multi-agency disaster coordination.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/flood-prediction"
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Run Breach Simulation</span>
          </Link>
          <Link
            to="/emergency-response"
            className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg shadow-md shadow-red-950 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Emergency Command</span>
          </Link>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Dams"
          value={DAMS_DATA.length}
          unit="Active"
          icon={Activity}
          color="cyan"
          description="CWC Grade-I Hydro Reservoirs"
          statusBadge="100% Online"
        />

        <StatCard
          title="Critical / High Alert"
          value={criticalDams.length}
          unit="Dams"
          icon={AlertOctagon}
          color="red"
          description="Exceeding Rule Curve / Sluice Surge"
          statusBadge="Action Required"
        />

        <StatCard
          title="National Reservoir Storage"
          value={avgStorage}
          unit="%"
          icon={Waves}
          color="amber"
          description="Aggregate Live Storage Ratio"
          statusBadge="Monsoon Level"
        />

        <StatCard
          title="Active Emergency Bulletins"
          value={activeAlertsCount}
          unit="Broadcasts"
          icon={ShieldAlert}
          color="red"
          description={`${criticalAlertsCount} Critical Flash Flood Warnings`}
          statusBadge="Code Red"
        />
      </div>

      {/* Main Interactive Map & Catchment Weather Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live GIS Map Card (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                Live Flood &amp; Dam Inundation GIS Map
              </h2>
            </div>
            <Link
              to="/live-map"
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
            >
              <span>Expand Map</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <FloodMap selectedDam={selectedDam} height="440px" />
        </div>

        {/* Right Column: Catchment Meteorology & Active Alerts */}
        <div className="space-y-4">
          <WeatherWidget damName={selectedDam?.name || "Hirakud Dam"} />

          <div className="p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-100 uppercase font-mono tracking-wider">
                Priority Flood Bulletins
              </h3>
              <Link to="/alerts" className="text-[11px] text-cyan-400 hover:underline">
                View All ({alerts.length})
              </Link>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {alerts.slice(0, 2).map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={acknowledgeAlert}
                  compact={true}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hydrograph and Dam Telemetry Selector Section */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                24-Hour Reservoir Hydrograph &amp; Discharge Telemetry
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live inflow vs spillway outflow and CWC danger mark threshold curves for{" "}
              <span className="font-semibold text-cyan-300">{selectedDam?.name}</span>
            </p>
          </div>

          {/* Dam Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Select Dam:</span>
            <select
              value={selectedDam?.id}
              onChange={(e) => {
                const found = DAMS_DATA.find((d) => d.id === e.target.value);
                if (found) setSelectedDam(found);
              }}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-sans"
            >
              {DAMS_DATA.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.state}) - {d.riskLevel}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chart */}
        <WaterLevelChart data={hydroData} dam={selectedDam} />
      </div>

      {/* Monitored Dams Health Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
              National Dam Fleet Telemetry Status
            </h3>
            <p className="text-xs text-slate-400">
              Live water level, gate aperture, and structural health metrics across all 8 monitored reservoirs
            </p>
          </div>
          <Link
            to="/dam-monitoring"
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
          >
            <span>View All Dams</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DAMS_DATA.slice(0, 4).map((dam) => (
            <DamHealthCard key={dam.id} dam={dam} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
