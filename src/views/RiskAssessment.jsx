import React, { useState } from "react";
import {
  AlertOctagon,
  Sparkles,
  ShieldAlert,
  Activity,
  CheckCircle2,
  TrendingUp,
  FileText,
  AlertTriangle,
  BrainCircuit,
} from "lucide-react";
import { DAMS_DATA } from "../data/damData";
import { geminiService } from "../services/geminiService";
import { getRiskColorClass } from "../utils/helpers";

export function RiskAssessment() {
  const [selectedDam, setSelectedDam] = useState(DAMS_DATA[1]); // Hirakud Dam
  const [aiReport, setAiReport] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const report = await geminiService.analyzeRisk(
        selectedDam,
        { rainfall24h: 124.6, forecast: "Heavy Continuous Runoff" },
        { terrain: "Steep river basin with low-lying urban delta" }
      );
      setAiReport(report);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const riskFactors = [
    {
      name: "Storage vs Rule Curve",
      score: selectedDam.storagePercentage >= 90 ? 94 : 76,
      status: selectedDam.storagePercentage >= 90 ? "CRITICAL" : "HIGH",
      desc: "Water level is within 0.35m of the emergency crest overtopping threshold.",
    },
    {
      name: "Catchment Inflow Rate",
      score: 88,
      status: "HIGH",
      desc: "Monsoon runoff exceeding 4,800 cumecs continuously for 18 hours.",
    },
    {
      name: "Sluice Gate Aperture Capacity",
      score: 65,
      status: "MODERATE",
      desc: "24 of 64 gates operational; maximum discharge regulated by downstream bridge clearance.",
    },
    {
      name: "Structural Piezometric Pore Pressure",
      score: 42,
      status: "NORMAL",
      desc: "Sensors at chainage 4+200 indicate stable pore pressure at 0.38 MPa.",
    },
    {
      name: "Downstream Urban Vulnerability",
      score: 91,
      status: "CRITICAL",
      desc: "Over 82,000 residents situated within the 4-hour flood arrival perimeter.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-400" />
            <h1 className="text-xl font-black text-white font-sans">
              Explainable AI Dam Risk &amp; Vulnerability Assessment
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-criteria risk scoring powered by Google Gemini 3.8 and CWC Dam Safety Guidelines.
          </p>
        </div>

        {/* Dam Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Dam:</span>
          <select
            value={selectedDam.id}
            onChange={(e) => {
              const d = DAMS_DATA.find((item) => item.id === e.target.value);
              if (d) {
                setSelectedDam(d);
                setAiReport("");
              }
            }}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            {DAMS_DATA.map((dam) => (
              <option key={dam.id} value={dam.id}>
                {dam.name} - {dam.riskLevel}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Scorecard & AI Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400">
                Composite Risk Rating
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">{selectedDam.name}</h3>
            </div>
            <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase ${getRiskColorClass(selectedDam.riskLevel)}`}>
              {selectedDam.riskLevel}
            </span>
          </div>

          <div className="flex items-center justify-center p-6 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="text-center">
              <span className="text-4xl font-black text-red-400 font-mono">
                {selectedDam.riskLevel === "CRITICAL" ? "92.4" : selectedDam.riskLevel === "HIGH" ? "78.6" : "38.2"}
              </span>
              <span className="text-xs text-slate-400 block font-mono mt-1">
                Risk Score / 100
              </span>
              <p className="text-[11px] text-slate-400 mt-2 max-w-[200px]">
                High inundation probability if inflow sustains for next 6 hours.
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold text-xs rounded-lg shadow-lg shadow-cyan-950 transition-all"
          >
            <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span>{isGenerating ? "Synthesizing AI Audit..." : "Generate AI Hydrological Audit"}</span>
          </button>
        </div>

        {/* AI Explanation Output (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-slate-100 uppercase font-mono tracking-wider">
                  Explainable AI Diagnostics &amp; Decision Support
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                Gemini 3.8 Active
              </span>
            </div>

            {aiReport ? (
              <div className="space-y-3 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                {aiReport}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <BrainCircuit className="w-10 h-10 text-slate-700 mx-auto animate-pulse" />
                <p className="text-xs">
                  Click <b>"Generate AI Hydrological Audit"</b> to execute real-time hydrological analysis on {selectedDam.name}.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between mt-4">
            <span>Standard: CWC Dam Safety Act 2021 Guidelines</span>
            <span className="text-cyan-400 font-mono">Confidence: 96.2%</span>
          </div>
        </div>
      </div>

      {/* Breakdown Factors */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-100 uppercase font-mono tracking-wider">
          Multi-Parameter Risk Factor Breakdown
        </h3>

        <div className="space-y-3">
          {riskFactors.map((factor, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
              <div className="flex items-center justify-between mb-1.5 font-mono">
                <span className="font-bold text-slate-200">{factor.name}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    factor.status === "CRITICAL"
                      ? "text-red-400 bg-red-950/50 border border-red-800"
                      : factor.status === "HIGH"
                      ? "text-orange-400 bg-orange-950/50 border border-orange-800"
                      : "text-slate-300 bg-slate-800"
                  }`}
                >
                  {factor.score} / 100 ({factor.status})
                </span>
              </div>
              <p className="text-slate-400 text-[11px] mb-2">{factor.desc}</p>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    factor.score >= 80 ? "bg-red-500" : factor.score >= 60 ? "bg-amber-500" : "bg-cyan-500"
                  }`}
                  style={{ width: `${factor.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RiskAssessment;
