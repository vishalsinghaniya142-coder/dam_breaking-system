import React from "react";
import {
  Shield,
  Award,
  Cpu,
  Waves,
  Globe,
  Radio,
  FileCheck,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Title & Banner */}
      <div className="text-center space-y-3 py-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-mono font-bold">
          <Award className="w-3.5 h-3.5 text-cyan-400" />
          <span>Smart India Hackathon 2026 &bull; Problem ID: SIH26161</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-sans">
          PRAVAH <span className="text-cyan-400 font-serif">प्रवाह</span>
        </h1>
        <p className="text-sm text-cyan-200/90 font-mono">
          AI Dam Flood Intelligence, Inundation Hydrodynamics &amp; Disaster Management
        </p>
        <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
          An integrated next-generation national platform bridging Central Water Commission (CWC) telemetry, physics-informed dam breach wave modeling, Google Gemini generative AI explanation, and real-time public evacuation command.
        </p>
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase font-mono">
            <Waves className="w-4 h-4" />
            <span>1. Hydrodynamic Telemetry Core</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Continuously ingests automated water levels, spillway discharge rates, reservoir storage ratios, and rule curves from CWC Grade-I hydro stations across all major river basins in India (Mahanadi, Ganga, Narmada, Sutlej, Periyar).
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase font-mono">
            <Cpu className="w-4 h-4" />
            <span>2. Delft3D &amp; SPH Breach Simulation</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Simulates earthen embankment failure, overtopping crest dynamics, and concrete monolith breaches using Froehlich empirical peak discharge equations, projecting flood arrival timeframes and high-velocity inundation perimeters.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase font-mono">
            <Shield className="w-4 h-4" />
            <span>3. Explainable Gemini AI Decision Engine</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Transforms dense hydrological telemetry into clear, human-understandable risk explanations, automated emergency bulletins, and tactical operational directives for district magistrates and disaster commanders.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase font-mono">
            <Globe className="w-4 h-4" />
            <span>4. Multilingual 12-Language Voice Accessibility</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Full native language localization across 12 scheduled Indian languages (Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, English) with voice synthesis for blind and visually impaired citizens.
          </p>
        </div>
      </div>

      {/* Statutory Alignment & Institutional Governance */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-100 uppercase font-mono tracking-wider flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-cyan-400" />
          <span>Statutory Alignment &amp; National Frameworks</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <strong className="text-slate-200 block mb-1">Dam Safety Act 2021</strong>
            <p className="text-slate-400 text-[11px]">
              Complies with mandatory emergency action plans (EAP), regular structural health telemetry, and public risk disclosure.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <strong className="text-slate-200 block mb-1">NDMA Guidelines</strong>
            <p className="text-slate-400 text-[11px]">
              Aligns with National Disaster Management Authority flood mitigation protocols, shelter elevation baselines, and inter-agency dispatch.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <strong className="text-slate-200 block mb-1">IMD Weather Radar</strong>
            <p className="text-slate-400 text-[11px]">
              Integrates Doppler radar precipitation thresholds to forecast convective cloudbursts before catchment runoff peaks.
            </p>
          </div>
        </div>
      </div>

      {/* Footer credits */}
      <div className="text-center text-xs text-slate-500 font-mono space-y-1">
        <p>Built for Smart India Hackathon (SIH26161) &bull; 2026</p>
        <p>Central Water Commission &bull; National Disaster Management Authority</p>
      </div>
    </div>
  );
}

export default About;
