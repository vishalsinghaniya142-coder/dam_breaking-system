import React from "react";

export function StatCard({
  title,
  value,
  unit = "",
  change = null,
  trend = "up",
  icon: Icon,
  color = "cyan",
  description = "",
  statusBadge = null,
}) {
  const colorMap = {
    cyan: {
      bg: "bg-cyan-950/30",
      border: "border-cyan-500/30",
      text: "text-cyan-400",
      glow: "hover:border-cyan-400/60",
      iconBg: "bg-cyan-500/10 text-cyan-400",
    },
    red: {
      bg: "bg-red-950/30",
      border: "border-red-500/30",
      text: "text-red-400",
      glow: "hover:border-red-400/60",
      iconBg: "bg-red-500/10 text-red-400",
    },
    amber: {
      bg: "bg-amber-950/30",
      border: "border-amber-500/30",
      text: "text-amber-400",
      glow: "hover:border-amber-400/60",
      iconBg: "bg-amber-500/10 text-amber-400",
    },
    emerald: {
      bg: "bg-emerald-950/30",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      glow: "hover:border-emerald-400/60",
      iconBg: "bg-emerald-500/10 text-emerald-400",
    },
    blue: {
      bg: "bg-blue-950/30",
      border: "border-blue-500/30",
      text: "text-blue-400",
      glow: "hover:border-blue-400/60",
      iconBg: "bg-blue-500/10 text-blue-400",
    },
  };

  const c = colorMap[color] || colorMap.cyan;

  return (
    <div
      className={`relative p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border ${c.border} ${c.glow} transition-all duration-200 shadow-md shadow-slate-950/40 flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="text-xs font-medium text-slate-400 tracking-wide uppercase font-mono">
            {title}
          </p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className={`text-2xl font-black tracking-tight font-sans text-slate-100`}>
              {value}
            </span>
            {unit && <span className="text-xs text-slate-400 font-medium">{unit}</span>}
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-lg ${c.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs mt-1 pt-2 border-t border-slate-800/80">
        <span className="text-slate-400 text-[11px] truncate">
          {description}
        </span>
        {statusBadge && (
          <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
            {statusBadge}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatCard;
