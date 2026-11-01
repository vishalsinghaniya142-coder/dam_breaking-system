import React from "react";
import { Mic, MicOff, Volume2, ShieldAlert, Sparkles, Navigation } from "lucide-react";
import { useVoiceAssistant } from "../hooks/useVoiceAssistant";
import { useEmergency } from "../context/EmergencyContext";

export function VoiceAssistant() {
  const {
    isListening,
    transcript,
    feedback,
    isSupported,
    startListening,
    stopListening,
    speak,
  } = useVoiceAssistant();
  const { speechSafetyMode, toggleSpeechSafetyMode } = useEmergency();

  if (!isSupported) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2">
      {/* Voice Assistant Pill */}
      <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-full px-3 py-1.5 shadow-xl shadow-slate-950/60">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isListening
              ? "bg-red-600 text-white animate-pulse ring-4 ring-red-500/40"
              : "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950"
          }`}
          title={isListening ? "Listening... click to stop" : "Activate Voice Command ('Open map', 'Nearest shelter', etc.)"}
        >
          {isListening ? <Mic className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
        </button>

        <div className="hidden sm:flex flex-col pr-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            {isListening ? "Voice Command Active" : "Voice Navigation"}
          </span>
          <span className="text-xs font-semibold text-cyan-300 truncate max-w-[180px]">
            {transcript || feedback || "Say 'Open Map' or 'Read alerts'"}
          </span>
        </div>

        {/* Quick audio toggle for Accessibility / Blind User Mode */}
        <button
          onClick={toggleSpeechSafetyMode}
          className={`p-1.5 rounded-full border text-xs transition-colors ${
            speechSafetyMode
              ? "bg-amber-500 text-slate-950 border-amber-400"
              : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
          }`}
          title="Voice-First Accessibility Safety Mode"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default VoiceAssistant;
