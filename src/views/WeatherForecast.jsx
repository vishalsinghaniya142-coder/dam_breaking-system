import React, { useState } from "react";
import {
  CloudRain,
  Wind,
  Droplets,
  CloudLightning,
  Gauge,
  MapPin,
} from "lucide-react";
import { useWeather } from "../hooks/useWeather";
import { DAMS_DATA } from "../data/damData";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import "./WeatherForecast.css";

function WeatherForecast() {
  const [selectedDamName, setSelectedDamName] = useState("Hirakud Dam");
  const { weather, hourly, weekly, loading } = useWeather(selectedDamName);

  if (loading) {
    return (
      <div className="weather-intelligence weather-state">
        <CloudRain className="weather-state-icon" aria-hidden="true" />
        <p>Loading catchment weather data...</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="weather-intelligence weather-state weather-state-error" role="alert">
        <CloudLightning className="weather-state-icon" aria-hidden="true" />
        <p>Weather data unavailable.</p>
      </div>
    );
  }

  return (
    <div className="weather-intelligence">
      <header className="weather-header">
        <div className="weather-heading">
          <div className="weather-heading-icon">
            <CloudRain aria-hidden="true" />
          </div>
          <div>
            <p className="weather-eyebrow">Monsoon observation network</p>
            <h1>Catchment Meteorology &amp; Doppler Radar</h1>
            <p className="weather-subtitle">
              IMD weather radar, precipitation forecasts, and cloudburst early detection.
            </p>
          </div>
        </div>

        <label className="weather-catchment">
          <span>
            <MapPin aria-hidden="true" />
            Catchment
          </span>
          <select
            value={selectedDamName}
            onChange={(event) => setSelectedDamName(event.target.value)}
          >
            {DAMS_DATA.map((dam) => (
              <option key={dam.id} value={dam.name}>
                {dam.name} ({dam.river} Basin)
              </option>
            ))}
          </select>
        </label>
      </header>

      <section className="weather-overview weather-card" aria-label="Current catchment conditions">
        <div className="weather-current">
          <div className="weather-current-icon">
            <CloudLightning aria-hidden="true" />
            <span className="weather-icon-rain weather-icon-rain-one" />
            <span className="weather-icon-rain weather-icon-rain-two" />
            <span className="weather-icon-rain weather-icon-rain-three" />
          </div>
          <div className="weather-current-copy">
            <div className="weather-live-line">
              <span className="weather-live-dot" />
              <span>Live catchment conditions</span>
              <span className="weather-alert-badge">IMD Red Alert</span>
            </div>
            <div className="weather-temperature">
              {weather.current.temperature}°C
              <span>{weather.current.condition}</span>
            </div>
            <p className="weather-location">{weather.current.location}</p>
          </div>
        </div>

        <div className="weather-metrics">
          <div className="weather-metric weather-metric-rain">
            <CloudRain aria-hidden="true" />
            <span>24h rainfall</span>
            <strong>{weather.current.rainfall24h} mm</strong>
          </div>
          <div className="weather-metric">
            <Wind aria-hidden="true" />
            <span>Wind speed</span>
            <strong>{weather.current.windSpeed} km/h</strong>
          </div>
          <div className="weather-metric">
            <Droplets aria-hidden="true" />
            <span>Humidity</span>
            <strong>{weather.current.humidity}%</strong>
          </div>
          <div className="weather-metric">
            <Gauge aria-hidden="true" />
            <span>Pressure</span>
            <strong>{weather.current.pressure} hPa</strong>
          </div>
        </div>
      </section>

      <section className="weather-card weather-chart-panel">
        <div className="weather-section-heading">
          <div>
            <p className="weather-eyebrow">Rainfall intelligence</p>
            <h2>12-hour precipitation forecast</h2>
          </div>
          <span className="weather-unit-chip">mm / hour</span>
        </div>

        <div className="weather-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourly} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="weatherRainfallGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#39e0f0" />
                  <stop offset="100%" stopColor="#1488d4" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(131, 184, 201, 0.13)" vertical={false} />
              <XAxis dataKey="time" stroke="#83B8C9" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#83B8C9" fontSize={10} unit=" mm" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0D2B3A",
                  borderColor: "#245061",
                  borderRadius: "12px",
                  color: "#E8FAFF",
                  fontSize: "12px",
                  boxShadow: "0 16px 40px rgba(0,0,0,.35)",
                }}
                labelStyle={{ color: "#83B8C9" }}
                formatter={(value) => [`${value} mm`, "Rainfall"]}
              />
              <Bar
                dataKey="rainfall"
                name="Rainfall"
                fill="url(#weatherRainfallGradient)"
                radius={[5, 5, 0, 0]}
                maxBarSize={44}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="weather-card weather-week-panel">
        <div className="weather-section-heading">
          <div>
            <p className="weather-eyebrow">Outlook across the basin</p>
            <h2>7-day river basin forecast</h2>
          </div>
          <span className="weather-unit-chip">Rainfall · temperature</span>
        </div>

        <div className="weather-week-grid">
          {weekly.map((day, index) => (
            <article
              key={`${day.day}-${day.date}-${index}`}
              className={`weather-day-card ${
                day.warning === "RED"
                  ? "weather-day-red"
                  : day.warning === "ORANGE"
                    ? "weather-day-orange"
                    : ""
              }`}
            >
              <div>
                <span className="weather-day-name">{day.day}</span>
                <span className="weather-day-date">{day.date}</span>
              </div>
              <CloudRain className="weather-day-icon" aria-hidden="true" />
              <div>
                <strong className="weather-day-rain">{day.rainfall} mm</strong>
                <span className="weather-day-temperature">
                  {day.tempMax}° / {day.tempMin}°
                </span>
              </div>
              {day.warning !== "NORMAL" && (
                <span className="weather-day-warning">{day.warning} WATCH</span>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export { WeatherForecast };
export default WeatherForecast;
