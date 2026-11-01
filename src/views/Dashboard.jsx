import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Bell, CloudRain,
  Cpu, Droplets, Gauge, MapPin, ShieldAlert, Waves, Wind, ChevronRight,
  Database, Zap, Clock3, TrendingUp, CheckCircle2
} from "lucide-react";
import { useEmergency } from "../context/EmergencyContext";
import { damService } from "../services/damService";
import { DAMS_DATA } from "../data/damData";
import { WeatherWidget } from "../components/WeatherWidget";
import { WaterLevelChart } from "../components/WaterLevelChart";
import { FloodMap } from "../components/FloodMap";
import { AlertCard } from "../components/AlertCard";
import "./Dashboard.css";

export function Dashboard() {
  const { alerts, activeAlertsCount, criticalAlertsCount, acknowledgeAlert } = useEmergency();
  const [selectedDam, setSelectedDam] = useState(DAMS_DATA[1] || DAMS_DATA[0]);
  const [hydroData, setHydroData] = useState([]);

  useEffect(() => {
    if (selectedDam) setHydroData(damService.getWaterLevelTrend(selectedDam.id, 24));
  }, [selectedDam]);

  const highRisk = DAMS_DATA.filter(d => ["CRITICAL", "HIGH"].includes(d.riskLevel)).length;
  const avgStorage = Math.round(DAMS_DATA.reduce((sum, d) => sum + d.storagePercentage, 0) / Math.max(DAMS_DATA.length, 1));

  return (
    <main className="pravah-dashboard">
      <header className="pd-header">
        <div>
          <div className="pd-eyebrow"><span className="pd-live-dot" /> NATIONAL FLOOD INTELLIGENCE · LIVE OPERATIONS</div>
          <h1>Welcome to <span>PRAVAH 360</span></h1>
          <p>AI-powered dam-break analysis, flood forecasting & early warning command center</p>
        </div>
        <div className="pd-header-actions">
          <div className="pd-data-status"><span className="pd-status-pulse" /> System operational <small>Telemetry connected</small></div>
          <Link to="/flood-prediction" className="pd-btn pd-btn-primary"><Cpu size={16}/> Run simulation</Link>
          <Link to="/emergency-response" className="pd-btn pd-btn-danger"><ShieldAlert size={16}/> Emergency command</Link>
        </div>
      </header>

      <section className="pd-kpis">
        <article className="pd-kpi"><div className="pd-kpi-icon blue"><Waves/></div><div><span>Monitored dams</span><strong>{DAMS_DATA.length}<small> Active</small></strong><em><CheckCircle2 size={13}/> Fleet monitoring</em></div></article>
        <article className="pd-kpi"><div className="pd-kpi-icon red"><AlertTriangle/></div><div><span>High / critical risk</span><strong>{highRisk}<small> Dams</small></strong><em className="warn"><ArrowUpRight size={13}/> Requires attention</em></div></article>
        <article className="pd-kpi"><div className="pd-kpi-icon cyan"><Droplets/></div><div><span>Average reservoir storage</span><strong>{avgStorage}<small>%</small></strong><em><TrendingUp size={13}/> Fleet-wide capacity</em></div></article>
        <article className="pd-kpi"><div className="pd-kpi-icon orange"><Bell/></div><div><span>Active flood alerts</span><strong>{activeAlertsCount}<small> Alerts</small></strong><em className="warn"><Zap size={13}/> {criticalAlertsCount} critical alerts</em></div></article>
      </section>

      <section className="pd-main-grid">
        <article className="pd-panel pd-map-panel">
          <div className="pd-panel-heading"><div><span className="pd-heading-icon"><MapPin size={16}/></span><div><h2>Flood propagation map</h2><p>Geospatial inundation & monitored catchment</p></div></div><Link to="/live-map">Explore map <ChevronRight size={15}/></Link></div>
          <div className="pd-map-wrap"><FloodMap selectedDam={selectedDam} height="430px"/></div>
          <div className="pd-map-legend"><span><i className="legend-dot severe"/> Severe inundation</span><span><i className="legend-dot moderate"/> Moderate risk</span><span><i className="legend-dot low"/> Low risk</span><span className="pd-map-note">Model visualization</span></div>
        </article>
        <aside className="pd-side-stack">
          <div className="pd-panel pd-weather-panel"><div className="pd-panel-heading compact"><div><span className="pd-heading-icon"><CloudRain size={16}/></span><div><h2>Catchment weather</h2><p>Selected dam conditions</p></div></div></div><WeatherWidget damName={selectedDam?.name || "Hirakud Dam"}/></div>
          <div className="pd-panel pd-alert-panel"><div className="pd-panel-heading compact"><div><span className="pd-heading-icon alert-icon"><Bell size={16}/></span><div><h2>Priority alerts</h2><p>Latest emergency bulletins</p></div></div><Link to="/alerts">View all <ChevronRight size={14}/></Link></div><div className="pd-alert-list">{alerts.slice(0,2).map(alert=><AlertCard key={alert.id} alert={alert} onAcknowledge={acknowledgeAlert} compact={true}/>)}</div></div>
        </aside>
      </section>

      <section className="pd-panel pd-chart-panel">
        <div className="pd-panel-heading"><div><span className="pd-heading-icon"><Activity size={16}/></span><div><h2>Reservoir hydrograph & discharge</h2><p>24-hour water-level trend and hydrological telemetry</p></div></div><label className="pd-select-label">MONITORING DAM <select value={selectedDam?.id || ""} onChange={e=>{const dam=DAMS_DATA.find(d=>d.id===e.target.value);if(dam)setSelectedDam(dam)}}>{DAMS_DATA.map(d=><option key={d.id} value={d.id}>{d.name} · {d.state}</option>)}</select></label></div>
        <WaterLevelChart data={hydroData} dam={selectedDam}/>
      </section>

      <section className="pd-bottom-grid">
        <article className="pd-panel"><div className="pd-panel-heading"><div><span className="pd-heading-icon"><Gauge size={16}/></span><div><h2>Dam fleet health</h2><p>Reservoir status across monitored assets</p></div></div><Link to="/dam-monitoring">All dams <ChevronRight size={15}/></Link></div><div className="pd-fleet-list">{DAMS_DATA.slice(0,5).map(d=><Link to={`/dam/${d.id}`} className="pd-fleet-row" key={d.id}><span className={`pd-risk-mark ${String(d.riskLevel).toLowerCase()}`}/><span className="pd-fleet-name"><b>{d.name}</b><small>{d.state} · {d.storagePercentage}% storage</small></span><span className={`pd-risk-tag ${String(d.riskLevel).toLowerCase()}`}>{d.riskLevel}</span><ChevronRight size={15}/></Link>)}</div></article>
        <article className="pd-panel pd-quick-panel"><div className="pd-panel-heading"><div><span className="pd-heading-icon"><Zap size={16}/></span><div><h2>Quick operations</h2><p>Response tools & intelligence</p></div></div></div><div className="pd-quick-links"><Link to="/flood-prediction"><span className="quick-icon"><Cpu/></span><span><b>Dam-break simulation</b><small>Configure breach parameters</small></span><ChevronRight/></Link><Link to="/risk-assessment"><span className="quick-icon amber"><AlertTriangle/></span><span><b>Risk assessment</b><small>Review vulnerable zones</small></span><ChevronRight/></Link><Link to="/reports"><span className="quick-icon green"><Database/></span><span><b>Generate reports</b><small>Export operational insights</small></span><ChevronRight/></Link></div><div className="pd-system-foot"><span className="pd-live-dot"/> PRAVAH 360 <span>AI-assisted decision support</span></div></article>
      </section>
      <footer className="pd-footer"><span><Activity size={13}/> Monitoring network active</span><span>Data values shown are platform telemetry / demo feed. Confirm official sources before operational decisions.</span></footer>
    </main>
  );
}
export default Dashboard;
