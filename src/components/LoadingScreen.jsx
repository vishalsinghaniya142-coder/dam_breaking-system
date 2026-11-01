import React from "react";
import { Shield, Waves } from "lucide-react";

export function LoadingScreen({ message = "Initializing Flood Intelligence System..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100">
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-24 h-24 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        <div className="absolute w-16 h-16 rounded-full border-2 border-blue-500/20 border-b-blue-400 animate-spin [animation-direction:reverse]" />
        <Shield className="w-8 h-8 text-cyan-400 absolute animate-pulse" />
      </div>

      <div className="text-center space-y-2 max-w-md px-4">
        <div className="flex items-center justify-center gap-2">
          <Waves className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold tracking-wider text-slate-100 font-sans">
            PRAVAH <span className="text-xs text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 font-mono">SIH26161</span>
          </h2>
        </div>
        <p className="text-sm text-cyan-200/80 font-mono tracking-wide animate-pulse">
          {message}
        </p>
        <p className="text-xs text-slate-400">
          Central Water Commission &bull; National Disaster Management Authority
        </p>
      </div>
    </div>
  );
}

export default LoadingScreen;
