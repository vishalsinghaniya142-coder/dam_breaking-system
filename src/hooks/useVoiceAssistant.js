import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { speakAlert, playChime } from "../utils/emergencyUtils";

export function useVoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const { activeLangObj } = useLanguage();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = activeLangObj?.speechCode || "en-IN";

        recognition.onstart = () => {
          setIsListening(true);
          playChime();
        };

        recognition.onresult = (event) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          processVoiceCommand(text);
        };

        recognition.onerror = (event) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [activeLangObj]);

  const processVoiceCommand = useCallback(
    (commandText) => {
      const cmd = commandText.toLowerCase();

      if (cmd.includes("map") || cmd.includes("flood map")) {
        setFeedback("Opening Live Flood GIS Map...");
        speakAlert("Opening Live Flood GIS Map");
        navigate("/live-map");
      } else if (cmd.includes("shelter") || cmd.includes("safe place")) {
        setFeedback("Locating nearest relief shelters...");
        speakAlert("Locating nearest emergency shelters. Navigating now.");
        navigate("/shelters");
      } else if (cmd.includes("risk") || cmd.includes("danger") || cmd.includes("threat")) {
        const msg = "Current national status: Hirakud Dam is in Critical surge status. Tehri Dam is at High alert. Stay tuned to safe routes.";
        setFeedback(msg);
        speakAlert(msg);
        navigate("/risk-assessment");
      } else if (cmd.includes("alert") || cmd.includes("warning")) {
        setFeedback("Opening active alerts and notifications...");
        speakAlert("Reading active alerts. Two critical flood bulletins are active.");
        navigate("/alerts");
      } else if (cmd.includes("emergency") || cmd.includes("evacuat")) {
        setFeedback("Activating Emergency Response command unit...");
        speakAlert("Opening emergency response module.");
        navigate("/emergency-response");
      } else if (cmd.includes("dam") || cmd.includes("monitoring")) {
        setFeedback("Opening Dam Monitoring system...");
        speakAlert("Opening Dam Monitoring dashboard.");
        navigate("/dam-monitoring");
      } else if (cmd.includes("weather") || cmd.includes("rain")) {
        setFeedback("Opening live weather telemetry...");
        speakAlert("Opening meteorological radar and rainfall forecasts.");
        navigate("/weather");
      } else if (cmd.includes("prediction") || cmd.includes("simulation")) {
        setFeedback("Opening AI flood prediction model...");
        speakAlert("Opening Delft3D and SPH flood prediction simulation.");
        navigate("/flood-prediction");
      } else if (cmd.includes("safe route") || cmd.includes("evacuation route")) {
        setFeedback("Opening safe evacuation routes...");
        speakAlert("Displaying safe highland evacuation corridors.");
        navigate("/safe-routes");
      } else {
        const response = `Understood: "${commandText}". Processing with PRAVAH AI Assistant.`;
        setFeedback(response);
        speakAlert(response);
      }
    },
    [navigate]
  );

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        setTranscript("");
        setFeedback("");
        recognitionRef.current.lang = activeLangObj?.speechCode || "en-IN";
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Could not start speech recognition:", err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speak = (text) => {
    speakAlert(text, activeLangObj?.speechCode || "en-IN");
  };

  return {
    isListening,
    transcript,
    feedback,
    isSupported,
    startListening,
    stopListening,
    speak,
    processVoiceCommand,
  };
}

export default useVoiceAssistant;
