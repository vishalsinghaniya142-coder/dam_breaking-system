import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

export function WaterLevelChart({ data, dam }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 font-mono text-xs">
        No hydrological telemetry available
      </div>
    );
  }

  const minLevel = Math.min(...data.map((d) => d.level), dam.warningLevel - 2);
  const maxLevel = Math.max(...data.map((d) => d.level), dam.dangerLevel + 2);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="levelGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="inflowGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="time"
            stroke="#64748b"
            fontSize={10}
            tickLine={false}
            axisLine={{ stroke: "#334155" }}
          />

          <YAxis
            yAxisId="level"
            domain={[Math.floor(minLevel), Math.ceil(maxLevel)]}
            stroke="#94a3b8"
            fontSize={10}
            tickLine={false}
            axisLine={{ stroke: "#334155" }}
            unit="m"
          />

          <YAxis
            yAxisId="flow"
            orientation="right"
            stroke="#64748b"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            unit=" m³/s"
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#334155",
              borderRadius: "0.5rem",
              fontSize: "0.75rem",
              color: "#f8fafc",
            }}
          />

          <Legend
            wrapperStyle={{ fontSize: "0.75rem", paddingTop: "0.5rem" }}
          />

          <ReferenceLine
            yAxisId="level"
            y={dam.dangerLevel}
            label={{
              value: `Danger (${dam.dangerLevel}m)`,
              fill: "#ef4444",
              fontSize: 10,
              position: "top",
            }}
            stroke="#ef4444"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />

          <ReferenceLine
            yAxisId="level"
            y={dam.warningLevel}
            label={{
              value: `Warning (${dam.warningLevel}m)`,
              fill: "#f59e0b",
              fontSize: 10,
              position: "top",
            }}
            stroke="#f59e0b"
            strokeDasharray="3 3"
          />

          <Area
            yAxisId="level"
            type="monotone"
            dataKey="level"
            name="Water Level (m)"
            stroke="#06b6d4"
            strokeWidth={2.5}
            fill="url(#levelGradient)"
          />

          <Line
            yAxisId="flow"
            type="monotone"
            dataKey="inflow"
            name="Inflow (cumecs)"
            stroke="#60a5fa"
            strokeWidth={1.5}
            dot={false}
          />

          <Line
            yAxisId="flow"
            type="monotone"
            dataKey="outflow"
            name="Discharge (cumecs)"
            stroke="#f97316"
            strokeWidth={1.5}
            strokeDasharray="4 2"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WaterLevelChart;
