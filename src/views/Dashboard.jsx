import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Bell, CloudRain,
  Cpu, Droplets, Gauge, MapPin, ShieldAlert, Waves, Wind, ChevronRight,
  Database, Zap, Clock3, TrendingUp, CheckCircle2, Play, Timer, Users, Home, BarChart3
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
  const [breachWidth, setBreachWidth] = useState(80);
  const [breachTime, setBreachTime] = useState(0.5);
  const [initialLevel, setInitialLevel] = useState(830);
  const [simulation, setSimulation] = useState(false);

  useEffect(() => {
    if (selectedDam) setHydroData(damService.getWaterLevelTrend(selectedDam.id, 24));
  }, [selectedDam]);

  const highRisk = DAMS_DATA.filter(d => ["CRITICAL", "HIGH"].includes(d.riskLevel)).length;
  const avgStorage = Math.round(DAMS_DATA.reduce((sum, d) => sum + d.storagePercentage, 0) / Math.max(DAMS_DATA.length, 1));

  return (
    <main className="pravah-dashboard">
      <header className="pd-header">
        <div>
          <div className="pd-eyebrow"><span className="pd-live-dot" /> DAM SAFETY & FLOOD INTELLIGENCE · LIVE</div>
          <h1>Welcome to <span>PRALAY</span></h1>
          <p>Dam Break Analysis · Flood Forecasting · Early Warning System</p>
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

      <section className="pd-reference-grid">
        <article className="pd-panel pd-map-panel">
          <div className="pd-panel-heading"><div><span className="pd-heading-icon"><MapPin size={16}/></span><div><h2>Flood propagation map</h2><p>Geospatial inundation & monitored catchment</p></div></div><Link to="/live-map">Explore map <ChevronRight size={15}/></Link></div>
          <div className="pd-map-wrap"><FloodMap selectedDam={selectedDam} height="430px"/></div>
          <div className="pd-map-legend"><span><i className="legend-dot severe"/> Severe inundation</span><span><i className="legend-dot moderate"/> Moderate risk</span><span><i className="legend-dot low"/> Low risk</span><span className="pd-map-note">Model visualization</span></div>
        </article>
        <aside className="pd-reference-side">
          <article className="pd-panel pd-simulation-panel">
            <div className="pd-panel-heading"><div><span className="pd-heading-icon"><Play size={16}/></span><div><h2>Dam break simulation</h2><p>Configure breach scenario</p></div></div></div>
            <div className="pd-sim-form">
              <label>Breach width (m)<input type="number" min="1" max="500" value={breachWidth} onChange={e=>setBreachWidth(Number(e.target.value))}/></label>
              <label>Breach time (hr)<input type="number" min="0.1" step="0.1" value={breachTime} onChange={e=>setBreachTime(Number(e.target.value))}/></label>
              <label>Initial water level (m)<input type="number" value={initialLevel} onChange={e=>setInitialLevel(Number(e.target.value))}/></label>
              <button className="pd-run-sim" onClick={()=>setSimulation(true)}><Play size={14}/> Run simulation</button>
              {simulation&&<div className="pd-sim-result"><CheckCircle2 size={14}/> Scenario configured · {breachWidth} m breach · {breachTime} hr</div>}
            </div>
          </article>
          <article className="pd-panel pd-risk-panel">
            <div className="pd-panel-heading compact"><div><span className="pd-heading-icon alert-icon"><ShieldAlert size={16}/></span><div><h2>Risk assessment</h2><p>Fleet risk distribution</p></div></div><Link to="/risk-assessment">Details <ChevronRight size={14}/></Link></div>
            <div className="pd-risk-content"><div className="pd-risk-donut"><strong>Risk<br/>Index</strong></div><div className="pd-risk-legend"><span><i className="risk-red"/>High risk <b>38%</b></span><span><i className="risk-orange"/>Medium <b>42%</b></span><span><i className="risk-green"/>Low risk <b>20%</b></span></div></div>
          </article>
          <article className="pd-panel pd-impact-panel"><div className="pd-panel-heading compact"><div><span className="pd-heading-icon"><Users size={16}/></span><div><h2>Impact summary</h2><p>Downstream exposure estimate</p></div></div></div><div className="pd-impact-rows"><span><Users size={14}/> Affected population <b>~2,38,000</b></span><span><Home size={14}/> Affected area <b>312.5 km²</b></span><span><Clock3 size={14}/> Flood arrival (Rishikesh) <b>~1 hr 42 min</b></span></div></article>
        </aside>
      </section>

      <section className="pd-main-grid">
          <div className="pd-panel pd-weather-panel"><div className="pd-panel-heading compact"><div><span className="pd-heading-icon"><CloudRain size={16}/></span><div><h2>Weather & rainfall</h2><p>Selected dam conditions</p></div></div></div><WeatherWidget damName={selectedDam?.name || "Hirakud Dam"}/></div>
          <div className="pd-panel pd-alert-panel"><div className="pd-panel-heading compact"><div><span className="pd-heading-icon alert-icon"><Bell size={16}/></span><div><h2>Priority alerts</h2><p>Latest emergency bulletins</p></div></div><Link to="/alerts">View all <ChevronRight size={14}/></Link></div><div className="pd-alert-list">{alerts.slice(0,2).map(alert=><AlertCard key={alert.id} alert={alert} onAcknowledge={acknowledgeAlert} compact={true}/>)}</div></div>
        </aside>
      </section>

      <section className="pd-panel pd-chart-panel">
        <div className="pd-panel-heading"><div><span className="pd-heading-icon"><Activity size={16}/></span><div><h2>Water level & rainfall trend</h2><p>24-hour water-level trend and hydrological telemetry</p></div></div><label className="pd-select-label">MONITORING DAM <select value={selectedDam?.id || ""} onChange={e=>{const dam=DAMS_DATA.find(d=>d.id===e.target.value);if(dam)setSelectedDam(dam)}}>{DAMS_DATA.map(d=><option key={d.id} value={d.id}>{d.name} · {d.state}</option>)}</select></label></div>
        <WaterLevelChart data={hydroData} dam={selectedDam}/>
      </section>

      <section className="pd-reference-bottom">
        <article className="pd-panel pd-arrival-panel"><div className="pd-panel-heading"><div><span className="pd-heading-icon"><Timer size={16}/></span><div><h2>Flood arrival time</h2><p>Estimated downstream propagation after breach</p></div></div></div><div className="pd-arrival-table"><div className="pd-arrival-row header"><span>Location</span><span>Distance</span><span>Arrival time</span></div><div className="pd-arrival-row"><span><MapPin size={13}/> New Tehri</span><span>12.4 km</span><b className="safe-time">0 hr 18 min</b></div><div className="pd-arrival-row"><span><MapPin size={13}/> Rishikesh</span><span>86.3 km</span><b className="warn-time">1 hr 42 min</b></div><div className="pd-arrival-row"><span><MapPin size={13}/> Haridwar</span><span>124.7 km</span><b className="danger-time">2 hr 36 min</b></div></div></article>
        <article className="pd-panel pd-notifications-panel"><div className="pd-panel-heading"><div><span className="pd-heading-icon alert-icon"><Bell size={16}/></span><div><h2>Alerts & notifications</h2><p>Latest safety advisories</p></div></div><Link to="/alerts">View all <ChevronRight size={14}/></Link></div><div className="pd-notice danger"><AlertTriangle/><div><b>High flood risk</b><small>Water level above 90%. Be prepared for evacuation.</small></div><time>2 min ago</time></div><div className="pd-notice warning"><CloudRain/><div><b>Heavy rainfall alert</b><small>56.2 mm rainfall recorded in last 24 hours.</small></div><time>18 min ago</time></div></article>
      </section>

      <section className="pd-bottom-grid">
        <article className="pd-panel"><div className="pd-panel-heading"><div><span className="pd-heading-icon"><Gauge size={16}/></span><div><h2>Dam fleet health</h2><p>Reservoir status across monitored assets</p></div></div><Link to="/dam-monitoring">All dams <ChevronRight size={15}/></Link></div><div className="pd-fleet-list">{DAMS_DATA.slice(0,5).map(d=><Link to={`/dam/${d.id}`} className="pd-fleet-row" key={d.id}><span className={`pd-risk-mark ${String(d.riskLevel).toLowerCase()}`}/><span className="pd-fleet-name"><b>{d.name}</b><small>{d.state} · {d.storagePercentage}% storage</small></span><span className={`pd-risk-tag ${String(d.riskLevel).toLowerCase()}`}>{d.riskLevel}</span><ChevronRight size={15}/></Link>)}</div></article>
        <article className="pd-panel pd-quick-panel"><div className="pd-panel-heading"><div><span className="pd-heading-icon"><Zap size={16}/></span><div><h2>Quick operations</h2><p>Response tools & intelligence</p></div></div></div><div className="pd-quick-links"><Link to="/flood-prediction"><span className="quick-icon"><Cpu/></span><span><b>Dam-break simulation</b><small>Configure breach parameters</small></span><ChevronRight/></Link><Link to="/risk-assessment"><span className="quick-icon amber"><AlertTriangle/></span><span><b>Risk assessment</b><small>Review vulnerable zones</small></span><ChevronRight/></Link><Link to="/reports"><span className="quick-icon green"><Database/></span><span><b>Generate reports</b><small>Export operational insights</small></span><ChevronRight/></Link></div><div className="pd-system-foot"><span className="pd-live-dot"/> PRALAY <span>Dam break early warning</span></div></article>
      </section>
      <footer className="pd-footer"><span><Activity size={13}/> Monitoring network active</span><span>Data values shown are platform telemetry / demo feed. Confirm official sources before operational decisions.</span></footer>
    </main>
  );
}
export default Dashboard;
