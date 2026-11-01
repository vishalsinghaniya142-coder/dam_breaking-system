import React from "react";
import { CloudRain, Wind, Droplets, Gauge, AlertCircle, Compass } from "lucide-react";
import { useWeather } from "../hooks/useWeather";

export function WeatherWidget({ damName = "Hirakud Dam" }) {
  const { weather, loading } = useWeather(damName);

  if (loading || !weather) {
    return (
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 animate-pulse h-48 flex items-center justify-center">
        <span className="text-xs text-slate-500 font-mono">Loading telemetry radar...</span>
      </div>
    );
  }

  const { current } = weather;

  return (
    <div className="p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-cyan-500/30 transition-all shadow-md shadow-slate-950/40">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
            Catchment Meteorology
          </span>
          <h3 className="text-sm font-bold text-slate-100 mt-0.5">{current.location}</h3>
        </div>

        <div className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 animate-pulse" />
          <span>IMD Red Alert</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-mono">24h Rainfall</p>
            <p className="text-base font-black text-cyan-300 font-sans">
              {current.rainfall24h} <span className="text-xs font-normal text-slate-400">mm</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-mono">Wind Speed</p>
            <p className="text-base font-black text-slate-200 font-sans">
              {current.windSpeed} <span className="text-xs font-normal text-slate-400">km/h ({current.windDirection})</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-1">
          <Droplets className="w-3 h-3 text-cyan-400" />
          <span>{current.humidity}% Hum</span>
        </div>
        <div className="flex items-center gap-1">
          <Gauge className="w-3 h-3 text-amber-400" />
          <span>{current.pressure} hPa</span>
        </div>
        <div className="flex items-center gap-1">
          <Compass className="w-3 h-3 text-emerald-400" />
          <span>{current.visibility} km Vis</span>
        </div>
      </div>
    </div>
  );
}

export default WeatherWidget;
