import React, { useState } from "react";
import {
  CloudRain,
  Wind,
  Droplets,
  CloudLightning,
  Gauge,
} from "lucide-react";
import { useWeather } from "../hooks/useWeather";
import { DAMS_DATA } from "../data/damData";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function WeatherForecast() {
  const [selectedDamName, setSelectedDamName] = useState("Hirakud Dam");

  const { weather, hourly, weekly, loading } =
    useWeather(selectedDamName);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-cyan-400">
        Loading weather data...
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="p-6 text-red-400">
        Weather data unavailable.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-cyan-400" />

            <h1 className="text-xl font-black text-white">
              Catchment Meteorology & Doppler Radar
            </h1>
          </div>

          <p className="text-xs text-slate-400 mt-1">
            IMD weather radar, precipitation forecasts, and cloudburst early detection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">
            Catchment:
          </span>

          <select
            value={selectedDamName}
            onChange={(e) => setSelectedDamName(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            {DAMS_DATA.map((dam) => (
              <option key={dam.id} value={dam.name}>
                {dam.name} ({dam.river} Basin)
              </option>
            ))}
          </select>
        </div>
      </div>


      {/* WEATHER SUMMARY */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">

        <div className="flex items-center gap-5">

          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <CloudLightning className="w-12 h-12 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                Live Catchment Conditions
              </span>

              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-600 text-white">
                IMD RED ALERT
              </span>
            </div>

            <h2 className="text-3xl font-black text-white mt-1">
              {weather.current.temperature}°C

              <span className="text-base font-normal text-slate-400 ml-2">
                {weather.current.condition}
              </span>
            </h2>

            <p className="text-xs text-slate-300 mt-1">
              {weather.current.location}
            </p>
          </div>
        </div>


        {/* WEATHER STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <CloudRain className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <span className="text-[10px] uppercase font-mono text-slate-400 block">
              24h Rain
            </span>
            <span className="font-bold text-slate-100 font-mono text-sm">
              {weather.current.rainfall24h} mm
            </span>
          </div>


          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <Wind className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <span className="text-[10px] uppercase font-mono text-slate-400 block">
              Wind
            </span>
            <span className="font-bold text-slate-100 font-mono text-sm">
              {weather.current.windSpeed} km/h
            </span>
          </div>


          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <Droplets className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <span className="text-[10px] uppercase font-mono text-slate-400 block">
              Humidity
            </span>
            <span className="font-bold text-slate-100 font-mono text-sm">
              {weather.current.humidity}%
            </span>
          </div>


          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <Gauge className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span className="text-[10px] uppercase font-mono text-slate-400 block">
              Barometer
            </span>
            <span className="font-bold text-slate-100 font-mono text-sm">
              {weather.current.pressure} hPa
            </span>
          </div>

        </div>
      </div>


      {/* HOURLY FORECAST */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">

        <h3 className="text-xs font-bold text-slate-100 uppercase font-mono tracking-wider mb-3">
          12-Hour Catchment Precipitation Forecast (mm/h)
        </h3>

        <div className="h-56 w-full">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart data={hourly}>

              <XAxis
                dataKey="time"
                stroke="#64748b"
                fontSize={10}
              />

              <YAxis
                stroke="#64748b"
                fontSize={10}
                unit=" mm"
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "0.5rem",
                  fontSize: "0.75rem",
                }}
              />

              <Bar
                dataKey="rainfall"
                name="Rainfall (mm)"
                fill="#06b6d4"
                radius={[4, 4, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>
      </div>


      {/* WEEKLY FORECAST */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">

        <h3 className="text-xs font-bold text-slate-100 uppercase font-mono tracking-wider mb-3">
          7-Day River Basin Synoptic Forecast
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">

          {weekly.map((day, idx) => (

            <div
              key={idx}
              className={`p-3 rounded-xl border text-center text-xs flex flex-col justify-between ${
                day.warning === "RED"
                  ? "bg-red-950/30 border-red-500/40"
                  : day.warning === "ORANGE"
                  ? "bg-orange-950/30 border-orange-500/40"
                  : "bg-slate-950/60 border-slate-800"
              }`}
            >

              <div>
                <span className="font-bold text-slate-200 block font-mono">
                  {day.day}
                </span>

                <span className="text-[10px] text-slate-500">
                  {day.date}
                </span>
              </div>

              <CloudRain className="w-5 h-5 text-cyan-400 mx-auto my-2" />

              <div>
                <span className="font-bold text-slate-100 font-mono text-sm block">
                  {day.rainfall} mm
                </span>

                <span className="text-[10px] text-slate-400 font-mono">
                  {day.tempMax}° / {day.tempMin}°
                </span>
              </div>

            </div>

          ))}

        </div>
      </div>

    </div>
  );
}

/* VERY IMPORTANT */
export { WeatherForecast };
export default WeatherForecast;