import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  CloudRain,
  Cpu,
  Droplets,
  Gauge,
  MapPin,
  Play,
  ShieldAlert,
  Timer,
  Users,
  Waves,
  Wind,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEmergency } from "../context/EmergencyContext";
import { damService } from "../services/damService";
import { floodPredictionService } from "../services/floodPredictionService";
import { DAMS_DATA } from "../data/damData";
import { WeatherWidget } from "../components/WeatherWidget";
import { WaterLevelChart } from "../components/WaterLevelChart";
import { FloodMap } from "../components/FloodMap";
import { useWeather } from "../hooks/useWeather";
import "./Dashboard.css";

const INITIAL_DAM = DAMS_DATA.find((dam) => dam.id === "dam-hirakud") || DAMS_DATA[0];

function formatArrivalTime(hours) {
  if (!Number.isFinite(hours)) return "—";
  const totalMinutes = Math.max(0, Math.round(hours * 60));
  const wholeHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return wholeHours ? `${wholeHours} hr ${minutes} min` : `${minutes} min`;
}

function formatRelativeTime(timestamp) {
  const elapsedMinutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000),
  );
  if (elapsedMinutes < 1) return "Just now";
  if (elapsedMinutes < 60) return `${elapsedMinutes} min ago`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  return `${elapsedHours} hr${elapsedHours === 1 ? "" : "s"} ago`;
}

function getSeverityClass(severity) {
  return String(severity || "LOW").toLowerCase().replace(/[^a-z0-9-]+/g, "-");
}

export function Dashboard() {
  const {
    alerts,
    activeAlertsCount,
    criticalAlertsCount,
    acknowledgeAlert,
  } = useEmergency();
  const [selectedDam, setSelectedDam] = useState(INITIAL_DAM);
  const [hydroData, setHydroData] = useState([]);
  const [scenario, setScenario] = useState(null);
  const [arrivalTimes, setArrivalTimes] = useState([]);
  const [breachWidth, setBreachWidth] = useState(120);
  const [breachTime, setBreachTime] = useState(0.5);
  const [initialLevel, setInitialLevel] = useState(INITIAL_DAM.currentWaterLevel);
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulationError, setSimulationError] = useState("");
  const { weather, hourly, loading: weatherLoading } = useWeather(
    selectedDam?.name || "Hirakud Dam",
  );

  useEffect(() => {
    if (selectedDam) {
      setHydroData(damService.getWaterLevelTrend(selectedDam.id, 24));
      setInitialLevel(selectedDam.currentWaterLevel);
      setSimulationResult(null);
    }
  }, [selectedDam]);

  useEffect(() => {
    let active = true;
    Promise.all([
      floodPredictionService.getActiveScenario(),
      floodPredictionService.getDistrictArrivalTimes(),
    ])
      .then(([activeScenario, downstreamArrivals]) => {
        if (active) {
          setScenario(activeScenario);
          setArrivalTimes(downstreamArrivals);
        }
      })
      .catch((error) => {
        console.error("PRALAY dashboard simulation data loading error:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  const riskDistribution = useMemo(() => {
    const counts = DAMS_DATA.reduce(
      (result, dam) => {
        const risk = String(dam.riskLevel).toUpperCase();
        if (risk === "HIGH" || risk === "CRITICAL") result.high += 1;
        else if (risk === "MODERATE" || risk === "MEDIUM") result.medium += 1;
        else result.low += 1;
        return result;
      },
      { high: 0, medium: 0, low: 0 },
    );
    const total = DAMS_DATA.length || 1;
    return {
      ...counts,
      highPercent: Math.round((counts.high / total) * 100),
      mediumPercent: Math.round((counts.medium / total) * 100),
      lowPercent: Math.round((counts.low / total) * 100),
    };
  }, []);

  const priorityAlert =
    alerts.find((alert) => alert.status === "ACTIVE" && alert.severity === "CRITICAL") ||
    alerts.find((alert) => alert.status === "ACTIVE" && alert.severity === "HIGH");
  const rain24h = weather?.current?.rainfall24h;
  const scenarioMatchesDam = scenario?.damId === selectedDam?.id;
  const affectedPopulation = scenarioMatchesDam
    ? scenario.estimatedPopulationAffected
    : selectedDam?.downstreamPopulation;
  const affectedArea = simulationResult?.inundationAreaKm2 ??
    (scenarioMatchesDam ? scenario.totalInundationAreaSqKm : null);
  const firstArrivalHours = simulationResult
    ? simulationResult.firstSettlementArrivalTimeHours + Number(breachTime)
    : scenarioMatchesDam
      ? arrivalTimes[0]?.arrivalTimeHours ?? null
      : null;
  const activeNotices = alerts
    .filter((alert) => alert.status === "ACTIVE")
    .slice(0, 3);

  function runSimulation(event) {
    event.preventDefault();
    setSimulationError("");

    try {
      const waterLevel = Number(initialLevel);
      const width = Number(breachWidth);
      const delay = Number(breachTime);
      if (
        !selectedDam ||
        !Number.isFinite(waterLevel) ||
        !Number.isFinite(width) ||
        !Number.isFinite(delay) ||
        waterLevel <= 0 ||
        width < 1 ||
        width > 500 ||
        delay < 0
      ) {
        setSimulationError("Enter valid breach parameters before running the scenario.");
        return;
      }

      const result = floodPredictionService.runCustomSimulation({
        dam: selectedDam,
        breachWidth: width,
        rainfallIntensity: Number(rain24h) || 0,
        overtoppingHeight: Math.max(
          0,
          waterLevel - selectedDam.currentWaterLevel,
        ),
      });
      setSimulationResult(result);
      setBreachTime(delay);
    } catch (error) {
      console.error("PRALAY dashboard simulation error:", error);
      setSimulationError("The simulation could not be completed. Please try again.");
    }
  }

  return (
    <main className="pralay-dashboard">
      <section className="pralay-hero">
        <video
          className="pralay-hero-video"
          src="/images/ocean-loop-ytmp4.savetube.vip.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="pralay-hero-content">
          <div className="pralay-eyebrow">
            <span className="pralay-live-dot" />
            NATIONAL DAM SAFETY &amp; FLOOD INTELLIGENCE
          </div>
          <h1>Welcome to <span>PRALAY</span></h1>
          <p>AI-powered dam break analysis, flood forecasting &amp; early warning system</p>
          <div className="pralay-hero-meta">
            <span><MapPin size={14} /> {selectedDam?.name}, {selectedDam?.state}</span>
            <span><Activity size={14} /> Monitoring network active</span>
          </div>
        </div>
        <div className="pralay-hero-actions">
          <label className="pralay-dam-select">
            <span>MONITORING DAM</span>
            <select
              value={selectedDam?.id || ""}
              onChange={(event) => {
                const dam = DAMS_DATA.find((item) => item.id === event.target.value);
                if (dam) setSelectedDam(dam);
              }}
            >
              {DAMS_DATA.map((dam) => (
                <option key={dam.id} value={dam.id}>{dam.name} · {dam.state}</option>
              ))}
            </select>
            <ChevronDown size={15} />
          </label>
          <Link to="/flood-prediction" className="pralay-hero-button">
            <Cpu size={16} /> Advanced simulation
          </Link>
        </div>
      </section>

      {priorityAlert && (
        <Link to="/alerts" className={`pralay-critical-banner ${getSeverityClass(priorityAlert.severity)}`}>
          <span className="pralay-critical-icon"><AlertTriangle size={18} /></span>
          <span className="pralay-critical-copy">
            <strong>{priorityAlert.severity} FLOOD ALERT</strong>
            <span>{priorityAlert.title} · {priorityAlert.location}</span>
          </span>
          <span className="pralay-critical-action">View alert <ChevronRight size={16} /></span>
        </Link>
      )}

      <section className="pralay-kpis" aria-label="Selected dam telemetry">
        <article className="pralay-kpi">
          <span className="pralay-kpi-icon cyan"><Waves size={19} /></span>
          <div className="pralay-kpi-copy">
            <span>Water level</span>
            <strong>{selectedDam?.currentWaterLevel?.toLocaleString("en-IN")} <small>m</small></strong>
            <em>Warning {selectedDam?.warningLevel} m</em>
          </div>
          <span className="pralay-kpi-trend"><ArrowUpRight size={15} /></span>
        </article>
        <article className="pralay-kpi">
          <span className="pralay-kpi-icon blue"><Wind size={19} /></span>
          <div className="pralay-kpi-copy">
            <span>Inflow</span>
            <strong>{selectedDam?.inflow?.toLocaleString("en-IN")} <small>m³/s</small></strong>
            <em>Upstream discharge</em>
          </div>
          <span className="pralay-kpi-trend"><Activity size={15} /></span>
        </article>
        <article className="pralay-kpi">
          <span className="pralay-kpi-icon violet"><Droplets size={19} /></span>
          <div className="pralay-kpi-copy">
            <span>Outflow</span>
            <strong>{selectedDam?.outflow?.toLocaleString("en-IN")} <small>m³/s</small></strong>
            <em>{selectedDam?.gatesOpen}/{selectedDam?.totalGates} gates open</em>
          </div>
          <span className="pralay-kpi-trend"><Activity size={15} /></span>
        </article>
        <article className="pralay-kpi">
          <span className="pralay-kpi-icon amber"><Gauge size={19} /></span>
          <div className="pralay-kpi-copy">
            <span>Reservoir storage</span>
            <strong>{selectedDam?.storagePercentage} <small>%</small></strong>
            <em>{selectedDam?.capacity?.toLocaleString("en-IN")} MCM capacity</em>
          </div>
          <span className="pralay-kpi-trend"><CloudRain size={15} /></span>
        </article>
      </section>

      <section className="pralay-primary-grid">
        <article className="pralay-panel pralay-map-panel">
          <div className="pralay-panel-heading">
            <div className="pralay-heading-copy">
              <span className="pralay-panel-icon"><MapPin size={17} /></span>
              <div>
                <h2>Flood propagation map</h2>
                <p>Live basin overview · monitored dams, rivers &amp; breach zones</p>
              </div>
            </div>
            <Link to="/live-map" className="pralay-text-link">Open full map <ChevronRight size={15} /></Link>
          </div>
          <div className="pralay-map-surface">
            <FloodMap selectedDam={selectedDam} height="440px" />
          </div>
          <div className="pralay-map-footer">
            <span><i className="pralay-legend-dot red" /> High depth</span>
            <span><i className="pralay-legend-dot orange" /> Moderate depth</span>
            <span><i className="pralay-legend-dot yellow" /> Low depth</span>
            <span className="pralay-map-attribution">Map layers and overlays remain interactive</span>
          </div>
        </article>

        <aside className="pralay-primary-side">
          <article className="pralay-panel pralay-simulation-panel">
            <div className="pralay-panel-heading">
              <div className="pralay-heading-copy">
                <span className="pralay-panel-icon"><Play size={16} /></span>
                <div><h2>Dam break simulation</h2><p>Configure a breach scenario</p></div>
              </div>
              <Link to="/flood-prediction" className="pralay-icon-link" aria-label="Open full simulation"><ChevronRight size={17} /></Link>
            </div>
            <form className="pralay-simulation-form" onSubmit={runSimulation}>
              <label>
                <span>Breach width <small>m</small></span>
                <input type="number" min="1" max="500" step="1" value={breachWidth} onChange={(event) => setBreachWidth(Number(event.target.value))} required />
              </label>
              <label>
                <span>Breach time <small>hr from now</small></span>
                <input type="number" min="0" max="72" step="0.1" value={breachTime} onChange={(event) => setBreachTime(Number(event.target.value))} required />
              </label>
              <label className="pralay-simulation-wide">
                <span>Initial water level <small>m</small></span>
                <input
                  type="number"
                  min="1"
                  max={selectedDam?.fullReservoirLevel ? selectedDam.fullReservoirLevel + 10 : undefined}
                  step="any"
                  value={initialLevel}
                  onChange={(event) => setInitialLevel(Number(event.target.value))}
                  required
                />
              </label>
              <button type="submit" className="pralay-run-button"><Play size={15} fill="currentColor" /> Run simulation</button>
              {simulationError && <p className="pralay-form-error" role="alert">{simulationError}</p>}
              {simulationResult && (
                <div className="pralay-simulation-result" role="status">
                  <CheckCircle2 size={15} />
                  <span>
                    Peak discharge <strong>{simulationResult.peakDischarge.toLocaleString("en-IN")} m³/s</strong>
                    <small>First settlement arrival in {formatArrivalTime(firstArrivalHours)}</small>
                  </span>
                </div>
              )}
            </form>
          </article>

          <article className="pralay-panel pralay-risk-panel">
            <div className="pralay-panel-heading">
              <div className="pralay-heading-copy">
                <span className="pralay-panel-icon amber"><ShieldAlert size={16} /></span>
                <div><h2>Risk assessment</h2><p>Monitored dam fleet</p></div>
              </div>
              <Link to="/risk-assessment" className="pralay-text-link">Details <ChevronRight size={14} /></Link>
            </div>
            <div className="pralay-risk-content">
              <div
                className="pralay-risk-donut"
                style={{
                  background: `conic-gradient(var(--pralay-accent) 0% ${riskDistribution.highPercent}%, var(--pralay-warning) ${riskDistribution.highPercent}% ${riskDistribution.highPercent + riskDistribution.mediumPercent}%, var(--pralay-success) ${riskDistribution.highPercent + riskDistribution.mediumPercent}% 100%)`,
                }}
              >
                <span><strong>{riskDistribution.highPercent}%</strong><small>high risk</small></span>
              </div>
              <div className="pralay-risk-legend">
                <span><i className="red" /> High / critical <b>{riskDistribution.highPercent}%</b></span>
                <span><i className="orange" /> Moderate <b>{riskDistribution.mediumPercent}%</b></span>
                <span><i className="green" /> Low / normal <b>{riskDistribution.lowPercent}%</b></span>
              </div>
            </div>
          </article>

          <article className="pralay-panel pralay-impact-panel">
            <div className="pralay-panel-heading compact">
              <div className="pralay-heading-copy">
                <span className="pralay-panel-icon"><Users size={16} /></span>
                <div><h2>Impact summary</h2><p>{selectedDam?.name} downstream basin</p></div>
              </div>
            </div>
            <div className="pralay-impact-rows">
              <span><Users size={14} /> Population at risk <b>{affectedPopulation ? `~${Number(affectedPopulation).toLocaleString("en-IN")}` : "—"}</b></span>
              <span><MapPin size={14} /> Modelled inundation <b>{affectedArea ? `${affectedArea.toLocaleString("en-IN")} km²` : "Run simulation"}</b></span>
              <span><Timer size={14} /> First arrival estimate <b>{firstArrivalHours == null ? "—" : formatArrivalTime(firstArrivalHours)}</b></span>
            </div>
          </article>
        </aside>
      </section>

      <section className="pralay-analytics-grid">
        <article className="pralay-panel pralay-chart-panel">
          <div className="pralay-panel-heading">
            <div className="pralay-heading-copy">
              <span className="pralay-panel-icon"><Activity size={16} /></span>
              <div><h2>Water level trend</h2><p>24-hour telemetry · {selectedDam?.name}</p></div>
            </div>
            <span className="pralay-data-badge"><span /> Dam telemetry</span>
          </div>
          <div className="pralay-chart-body">
            <WaterLevelChart data={hydroData} dam={selectedDam} />
          </div>
        </article>

        <article className="pralay-panel pralay-chart-panel pralay-rain-chart-panel">
          <div className="pralay-panel-heading">
            <div className="pralay-heading-copy">
              <span className="pralay-panel-icon blue"><CloudRain size={16} /></span>
              <div><h2>Rainfall forecast</h2><p>Hourly catchment precipitation</p></div>
            </div>
            <span className="pralay-data-badge"><span /> {weather?.isLive ? "Live weather" : "Weather feed"}</span>
          </div>
          <div className="pralay-chart-body pralay-rain-chart">
            {hourly.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourly} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(161, 161, 170, 0.2)" strokeDasharray="3 5" vertical={false} />
                  <XAxis dataKey="time" tick={{ fill: "#a1a1aa", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "#552027" }} />
                  <YAxis tick={{ fill: "#a1a1aa", fontSize: 10 }} tickLine={false} axisLine={false} unit=" mm" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1014", borderColor: "#552027", borderRadius: 10, color: "#f8fafc", fontSize: 12 }}
                    formatter={(value) => [`${value} mm`, "Rainfall"]}
                  />
                  <Bar dataKey="rainfall" name="Rainfall" fill="var(--pralay-telemetry)" radius={[4, 4, 0, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="pralay-chart-empty">{weatherLoading ? "Loading rainfall telemetry…" : "No hourly rainfall telemetry available"}</div>
            )}
          </div>
          <div className="pralay-rain-summary">
            <span><CloudRain size={14} /> 24h rainfall</span>
            <strong>{rain24h == null ? "—" : `${rain24h} mm`}</strong>
          </div>
        </article>
      </section>

      <section className="pralay-operations-grid">
        <article className="pralay-panel pralay-arrival-panel">
          <div className="pralay-panel-heading">
            <div className="pralay-heading-copy">
              <span className="pralay-panel-icon"><Clock3 size={16} /></span>
              <div>
                <h2>Flood arrival timeline</h2>
                <p>{scenario?.damName ? `Active scenario · ${scenario.damName}` : "Downstream forecast"}</p>
              </div>
            </div>
            <Link to="/flood-prediction" className="pralay-text-link">Scenario <ChevronRight size={14} /></Link>
          </div>
          {arrivalTimes.length ? (
            <div className="pralay-arrival-list">
              {arrivalTimes.map((arrival, index) => (
                <div className="pralay-arrival-row" key={`${arrival.district}-${arrival.distanceKm}`}>
                  <span className={`pralay-arrival-marker ${getSeverityClass(arrival.status)}`}>{index + 1}</span>
                  <span className="pralay-arrival-location"><b>{arrival.district}</b><small>{arrival.distanceKm} km downstream · {arrival.maxDepthMeters} m max depth</small></span>
                  <span className={`pralay-arrival-time ${getSeverityClass(arrival.status)}`}>{formatArrivalTime(arrival.arrivalTimeHours)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="pralay-chart-empty">Loading downstream arrival estimates…</div>
          )}
        </article>

        <article className="pralay-panel pralay-alert-panel">
          <div className="pralay-panel-heading">
            <div className="pralay-heading-copy">
              <span className="pralay-panel-icon amber"><Bell size={16} /></span>
              <div><h2>Alerts &amp; notifications</h2><p>{activeAlertsCount} active · {criticalAlertsCount} critical</p></div>
            </div>
            <Link to="/alerts" className="pralay-text-link">All alerts <ChevronRight size={14} /></Link>
          </div>
          <div className="pralay-alert-list">
            {activeNotices.length ? activeNotices.map((alert) => (
              <article className={`pralay-notice ${getSeverityClass(alert.severity)}`} key={alert.id}>
                <span className="pralay-notice-icon"><AlertTriangle size={15} /></span>
                <div className="pralay-notice-copy">
                  <strong>{alert.title}</strong>
                  <small>{alert.location}</small>
                </div>
                <time dateTime={alert.timestamp}>{formatRelativeTime(alert.timestamp)}</time>
                <button type="button" onClick={() => acknowledgeAlert(alert.id)} aria-label={`Acknowledge ${alert.title}`} title="Acknowledge alert">
                  <CheckCircle2 size={15} />
                </button>
              </article>
            )) : (
              <div className="pralay-no-alerts"><CheckCircle2 size={17} /> No active alerts</div>
            )}
          </div>
        </article>
      </section>

      <section className="pralay-bottom-grid">
        <article className="pralay-panel pralay-fleet-panel">
          <div className="pralay-panel-heading">
            <div className="pralay-heading-copy">
              <span className="pralay-panel-icon"><Gauge size={16} /></span>
              <div><h2>Dam fleet status</h2><p>Reservoir conditions across monitored assets</p></div>
            </div>
            <Link to="/dam-monitoring" className="pralay-text-link">All dams <ChevronRight size={14} /></Link>
          </div>
          <div className="pralay-fleet-list">
            {DAMS_DATA.slice(0, 5).map((dam) => (
              <Link to={`/dam/${dam.id}`} className="pralay-fleet-row" key={dam.id}>
                <span className={`pralay-fleet-status ${getSeverityClass(dam.riskLevel)}`} />
                <span><b>{dam.name}</b><small>{dam.state} · {dam.storagePercentage}% storage</small></span>
                <strong className={`pralay-risk-tag ${getSeverityClass(dam.riskLevel)}`}>{dam.riskLevel}</strong>
                <ChevronRight size={15} />
              </Link>
            ))}
          </div>
        </article>
        <article className="pralay-panel pralay-weather-panel">
          <div className="pralay-panel-heading">
            <div className="pralay-heading-copy">
              <span className="pralay-panel-icon blue"><CloudRain size={16} /></span>
              <div><h2>Catchment conditions</h2><p>Weather monitoring · {selectedDam?.name}</p></div>
            </div>
            <Link to="/weather" className="pralay-text-link">Forecast <ChevronRight size={14} /></Link>
          </div>
          <div className="pralay-weather-body">
            <WeatherWidget
              damName={selectedDam?.name || "Hirakud Dam"}
              weatherData={weather}
              weatherLoading={weatherLoading}
              managedExternally
            />
          </div>
        </article>
      </section>

      <footer className="pralay-dashboard-footer">
        <span><Activity size={14} /> PRALAY monitoring network</span>
        <span>Telemetry and forecasts depend on configured live data sources. Verify official advisories during emergencies.</span>
      </footer>
    </main>
  );
}

export default Dashboard;
