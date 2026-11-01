import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { BarChart3, TrendingUp, Waves, Droplet } from "lucide-react";
import { DAMS_DATA } from "../data/damData";

export function Analytics() {
  const barData = DAMS_DATA.map((dam) => ({
    name: dam.name.replace(" Dam", ""),
    storage: dam.storagePercentage,
    inflow: dam.inflow,
    outflow: dam.outflow,
  }));

  const riskDistribution = [
    { name: "Critical (Red)", value: DAMS_DATA.filter((d) => d.riskLevel === "CRITICAL").length, color: "#ef4444" },
    { name: "High Alert (Orange)", value: DAMS_DATA.filter((d) => d.riskLevel === "HIGH").length, color: "#f97316" },
    { name: "Moderate (Yellow)", value: DAMS_DATA.filter((d) => d.riskLevel === "MODERATE").length, color: "#f59e0b" },
    { name: "Normal (Green)", value: DAMS_DATA.filter((d) => d.riskLevel === "NORMAL").length, color: "#10b981" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-black text-white font-sans">
            National Hydrological Storage &amp; Runoff Analytics
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Comparative storage capacity utilization, flood hydrographs, and risk distribution across India.
        </p>
      </div>

      {/* Storage Comparison Chart */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
        <h3 className="text-xs font-bold text-slate-100 uppercase font-mono tracking-wider mb-3">
          Reservoir Storage Capacity Utilization (% of FRL)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={10} unit="%" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "0.5rem",
                  fontSize: "0.75rem",
                }}
              />
              <Bar dataKey="storage" name="Storage %" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inflow vs Outflow & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <h3 className="text-xs font-bold text-slate-100 uppercase font-mono tracking-wider mb-3">
            Inflow vs Sluice Discharge (cumecs)
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} unit=" m³/s" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.5rem",
                    fontSize: "0.75rem",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="inflow" name="Inflow" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outflow" name="Discharge" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <h3 className="text-xs font-bold text-slate-100 uppercase font-mono tracking-wider mb-3">
            Dam Alert Level Distribution
          </h3>
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.5rem",
                    fontSize: "0.75rem",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
