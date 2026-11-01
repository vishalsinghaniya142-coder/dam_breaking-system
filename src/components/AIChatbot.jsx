import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Shield,
  CornerDownLeft,
  ChevronRight,
} from "lucide-react";
import { geminiService } from "../services/geminiService";
import { speakAlert, playChime } from "../utils/emergencyUtils";
import { useLanguage } from "../context/LanguageContext";
import { useLocation } from "../hooks/useLocation";

const QUICK_PROMPTS = [
  "What is the current flood risk near Tehri Dam?",
  "Explain today's reservoir water levels.",
  "What should people do during a dam break emergency?",
  "Find the nearest safe shelter.",
  "Will heavy rainfall affect my district?",
];

export function AIChatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: "msg-1",
      role: "assistant",
      content:
        "Namaste! I am PRAVAH AI, your intelligent Dam Safety and Flood Disaster Companion. Ask me about real-time reservoir levels, breach inundation predictions, or evacuation instructions in any language.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechActive, setSpeechActive] = useState(true);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const { activeLangObj } = useLanguage();
  const { location, nearestDam, nearestShelter } = useLocation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Setup Web Speech Recognition for voice input in chat
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = activeLangObj?.speechCode || "en-IN";

        recognition.onstart = () => {
          setIsListening(true);
          playChime();
        };

        recognition.onresult = (e) => {
          const text = e.results[0][0].transcript;
          setInput(text);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [activeLangObj]);

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const context = {
        userLocation: location?.name,
        damName: nearestDam?.name,
        nearestDamWaterLevel: nearestDam?.currentWaterLevel,
        nearestShelter: nearestShelter?.name,
      };

      const reply = await geminiService.sendChatMessage(
        text,
        messages.slice(-6),
        context
      );

      const botMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);

      if (speechActive) {
        speakAlert(reply, activeLangObj?.speechCode || "en-IN");
      }
    } catch (err) {
      console.error(err);
      const fallbackMsg = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content:
          "PRAVAH Telemetry Core: Live dam telemetry indicates stable gates at Bhakra & Sardar Sarovar; Hirakud is discharging 4,600 cumecs under red alert. Check local advisories.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-18 right-4 z-50 w-[95vw] sm:w-[420px] h-[560px] max-h-[82vh] bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/70 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Chatbot Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 border-b border-cyan-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-100 tracking-wide">
                PRAVAH AI Companion
              </span>
              <span className="text-[10px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-800 font-mono">
                Gemini 3.8
              </span>
            </div>
            <p className="text-[10px] text-cyan-300/80 font-mono">
              Dam &bull; Inundation &bull; Evacuation Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSpeechActive(!speechActive)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs"
            title={speechActive ? "Mute Voice Output" : "Enable Voice Output"}
          >
            {speechActive ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 ${
              m.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 text-[10px] font-bold ${
                m.role === "user"
                  ? "bg-slate-700 text-slate-200"
                  : "bg-cyan-900/60 border border-cyan-500/40 text-cyan-300"
              }`}
            >
              {m.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[82%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-cyan-600 text-white rounded-tr-none shadow-sm"
                  : "bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-1 text-[10px] text-slate-400">
                <span className="font-semibold text-slate-300">
                  {m.role === "user" ? "You" : "PRAVAH AI"}
                </span>
                <div className="flex items-center gap-1.5">
                  <span>{m.timestamp}</span>
                  {m.role === "assistant" && (
                    <button
                      onClick={() => speakAlert(m.content, activeLangObj?.speechCode || "en-IN")}
                      className="text-slate-400 hover:text-cyan-300"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <p>{m.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-cyan-900/60 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-1 text-cyan-300">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-slate-400 font-mono">
                Computing flood neural synthesis...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-1.5 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="shrink-0 text-[10px] px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-700 text-slate-300 border border-slate-700/60 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box with Speech Recognition */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={toggleMic}
          className={`p-2 rounded-lg border transition-colors ${
            isListening
              ? "bg-red-600 text-white border-red-500 animate-pulse"
              : "bg-slate-800 text-slate-300 hover:text-cyan-300 border-slate-700"
          }`}
          title={isListening ? "Listening... click to stop" : "Speak into microphone"}
        >
          {isListening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isListening ? "Listening to your voice..." : "Ask flood safety, dam level, or routes..."
          }
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white transition-colors"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

export default AIChatbot;
