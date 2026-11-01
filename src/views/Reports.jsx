import React, { useState } from "react";
import { FileText, Download, Printer, Calendar, Shield, CheckCircle } from "lucide-react";
import { DAMS_DATA } from "../data/damData";

export function Reports() {
  const [selectedDam, setSelectedDam] = useState(DAMS_DATA[1]);
  const [reportDate, setReportDate] = useState("2026-09-13");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-black text-white font-sans">
              Hydrological Compliance &amp; CWC Safety Reports
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated daily reservoir status logs, rule curve compliance certifications, and disaster audit summaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Bulletin</span>
          </button>
        </div>
      </div>

      {/* Selectors */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono">Dam Facility:</span>
          <select
            value={selectedDam.id}
            onChange={(e) => {
              const d = DAMS_DATA.find((item) => item.id === e.target.value);
              if (d) setSelectedDam(d);
            }}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            {DAMS_DATA.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.state})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono">Report Date:</span>
          <input
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Official Report Document Container */}
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 text-slate-200">
        {/* Document Header */}
        <div className="border-b border-slate-700 pb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-black tracking-wider text-white">
                CENTRAL WATER COMMISSION &bull; PRAVAH DISASTER COMMAND
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              DAILY HYDROLOGICAL TELEMETRY &amp; SPILLWAY SURGE AUDIT REPORT
            </p>
          </div>
          <div className="text-right text-xs font-mono text-slate-400">
            <div>Document No: CWC-HYD-2026-0913</div>
            <div>Date: {reportDate} 08:00 IST</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-slate-100 font-mono uppercase tracking-wider">
            1. Executive Telemetric Summary: {selectedDam.name}
          </h3>
          <p className="text-slate-300 leading-relaxed">
            The reservoir water level for {selectedDam.name} ({selectedDam.river} River, {selectedDam.state}) is measured at{" "}
            <strong className="text-cyan-300">{selectedDam.currentWaterLevel} meters</strong>, which represents{" "}
            <strong className="text-amber-300">{selectedDam.storagePercentage}%</strong> of the Full Reservoir Level (FRL {selectedDam.fullReservoirLevel}m).
            Incoming flood discharge currently stands at {selectedDam.inflow} cumecs with an authorized spillway discharge of {selectedDam.outflow} cumecs through {selectedDam.gatesOpen} sluice gates.
          </p>
        </div>

        {/* Quantitative Compliance Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
            2. Hydrodynamic Parameters &amp; Thresholds
          </h3>
          <table className="w-full text-left text-xs border border-slate-800 divide-y divide-slate-800">
            <thead className="bg-slate-950 font-mono text-slate-400">
              <tr>
                <th className="p-2.5">Telemetry Parameter</th>
                <th className="p-2.5">Recorded Value</th>
                <th className="p-2.5">CWC Safe Rule Limit</th>
                <th className="p-2.5">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              <tr>
                <td className="p-2.5">Reservoir Water Elevation</td>
                <td className="p-2.5 font-bold text-white">{selectedDam.currentWaterLevel} m</td>
                <td className="p-2.5">Danger: {selectedDam.dangerLevel} m</td>
                <td className="p-2.5 text-amber-400 font-bold">WARNING ZONE</td>
              </tr>
              <tr>
                <td className="p-2.5">Live Storage Ratio</td>
                <td className="p-2.5 font-bold text-white">{selectedDam.storagePercentage}%</td>
                <td className="p-2.5">Rule Curve Max: 90.0%</td>
                <td className="p-2.5 text-red-400 font-bold">ELEVATED</td>
              </tr>
              <tr>
                <td className="p-2.5">Discharge Surge Rate</td>
                <td className="p-2.5 font-bold text-white">{selectedDam.outflow} m³/s</td>
                <td className="p-2.5">Channel Capacity: 4,800 m³/s</td>
                <td className="p-2.5 text-emerald-400 font-bold">CONTROLLED</td>
              </tr>
              <tr>
                <td className="p-2.5">Piezometer Pore Pressure</td>
                <td className="p-2.5 font-bold text-white">0.38 MPa</td>
                <td className="p-2.5">Design Max: 0.65 MPa</td>
                <td className="p-2.5 text-emerald-400 font-bold">SAFE</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signature & Compliance Sign-off */}
        <div className="pt-6 border-t border-slate-800 flex justify-between items-end text-xs font-mono text-slate-400">
          <div>
            <div>Certified by: Chief Hydrological Engineer</div>
            <div className="text-white font-bold font-sans mt-0.5">Central Water Commission (CWC) Command</div>
          </div>
          <div className="text-right">
            <span className="text-cyan-400 font-bold">PRAVAH SYSTEM AUTOMATED DIGEST</span>
            <div>Verified with SHA-256 Hash: 9b82c3...f4a1</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
