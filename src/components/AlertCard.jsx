import React from "react";
import { AlertTriangle, Siren, Volume2, CheckCircle2, Clock, MapPin, ArrowRight } from "lucide-react";
import { speakAlert } from "../utils/emergencyUtils";
import { formatTimeAgo } from "../utils/helpers";
import { useLanguage } from "../context/LanguageContext";

export function AlertCard({ alert, onAcknowledge, compact = false }) {
  const { activeLangObj } = useLanguage();

  const getSeverityStyle = (severity) => {
    switch (severity?.toUpperCase()) {
      case "CRITICAL":
        return {
          border: "border-red-500/50 hover:border-red-400",
          bg: "bg-red-950/20",
          badge: "bg-red-600 text-white animate-pulse",
          icon: Siren,
          iconColor: "text-red-400",
        };
      case "HIGH":
        return {
          border: "border-orange-500/50 hover:border-orange-400",
          bg: "bg-orange-950/20",
          badge: "bg-orange-500 text-slate-950 font-bold",
          icon: AlertTriangle,
          iconColor: "text-orange-400",
        };
      case "MODERATE":
        return {
          border: "border-amber-500/40 hover:border-amber-400",
          bg: "bg-amber-950/15",
          badge: "bg-amber-500/20 text-amber-300 border border-amber-500/40",
          icon: AlertTriangle,
          iconColor: "text-amber-400",
        };
      default:
        return {
          border: "border-sky-500/30 hover:border-sky-400",
          bg: "bg-sky-950/15",
          badge: "bg-sky-500/20 text-sky-300 border border-sky-500/40",
          icon: AlertTriangle,
          iconColor: "text-sky-400",
        };
    }
  };

  const style = getSeverityStyle(alert.severity);
  const Icon = style.icon;

  const handleReadAloud = () => {
    speakAlert(
      `${alert.severity} ALERT: ${alert.title}. ${alert.description}. Recommended action: ${alert.recommendedAction}`,
      activeLangObj?.speechCode || "en-IN"
    );
  };

  return (
    <div
      className={`p-4 rounded-xl border ${style.border} ${style.bg} backdrop-blur-sm transition-all duration-200 shadow-md shadow-slate-950/40 flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider ${style.badge}`}>
              {alert.severity}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {alert.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimeAgo(alert.timestamp)}</span>
          </div>
        </div>

        <h3 className="text-sm font-bold text-slate-100 mb-1 flex items-start gap-2">
          <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${style.iconColor}`} />
          <span>{alert.title}</span>
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed mb-3">
          {alert.description}
        </p>

        {alert.location && (
          <div className="flex items-center gap-1.5 text-xs text-cyan-300/90 font-mono mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{alert.location}</span>
          </div>
        )}

        {alert.recommendedAction && !compact && (
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-amber-200/90 flex items-start gap-2 mb-3">
            <span className="font-bold text-amber-400 shrink-0 uppercase tracking-wider text-[10px] mt-0.5">
              Action:
            </span>
            <span>{alert.recommendedAction}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-1">
        <button
          onClick={handleReadAloud}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
          title="Read alert aloud"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Listen</span>
        </button>

        {onAcknowledge && alert.status !== "ACKNOWLEDGED" && (
          <button
            onClick={() => onAcknowledge(alert.id)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Acknowledge</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default AlertCard;
