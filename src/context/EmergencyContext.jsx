import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_ALERTS } from "../data/mockAlerts";
import { playEmergencyAlertSound, speakAlert } from "../utils/emergencyUtils";

export const EmergencyContext = createContext(null);

export function EmergencyProvider({ children }) {
  const [emergencyModeActive, setEmergencyModeActive] = useState(false);
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [speechSafetyMode, setSpeechSafetyMode] = useState(() => {
    return localStorage.getItem("pravah_speech_safety") === "true";
  });
  const [audioMuted, setAudioMuted] = useState(false);

  useEffect(() => {
    localStorage.setItem("pravah_speech_safety", String(speechSafetyMode));
  }, [speechSafetyMode]);

  const toggleEmergencyMode = () => {
    setEmergencyModeActive((prev) => {
      const next = !prev;
      if (next) {
        if (!audioMuted) playEmergencyAlertSound();
        if (speechSafetyMode) {
          speakAlert("EMERGENCY PROTOCOL ACTIVATED. Critical dam flood warning in effect. Please check safe evacuation routes and nearest high-ground shelters immediately.");
        }
      }
      return next;
    });
  };

  const broadcastAlert = (newAlert) => {
    const alertWithMeta = {
      id: `alert-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: "ACTIVE",
      ...newAlert,
    };
    setAlerts((prev) => [alertWithMeta, ...prev]);

    if (alertWithMeta.severity === "CRITICAL" || alertWithMeta.severity === "HIGH") {
      if (!audioMuted) playEmergencyAlertSound();
      if (speechSafetyMode) {
        speakAlert(`ALERT: ${alertWithMeta.title}. ${alertWithMeta.recommendedAction}`);
      }
    }
  };

  const acknowledgeAlert = (alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: "ACKNOWLEDGED" } : a))
    );
  };

  const dismissAlert = (alertId) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const toggleSpeechSafetyMode = () => {
    setSpeechSafetyMode((prev) => {
      const next = !prev;
      if (next) {
        speakAlert("Voice Safety Mode Enabled. Critical alerts will be read aloud automatically.");
      }
      return next;
    });
  };

  return (
    <EmergencyContext.Provider
      value={{
        emergencyModeActive,
        setEmergencyModeActive,
        toggleEmergencyMode,
        alerts,
        activeAlertsCount: alerts.filter((a) => a.status === "ACTIVE").length,
        criticalAlertsCount: alerts.filter((a) => a.severity === "CRITICAL" && a.status === "ACTIVE").length,
        broadcastAlert,
        acknowledgeAlert,
        dismissAlert,
        speechSafetyMode,
        toggleSpeechSafetyMode,
        audioMuted,
        setAudioMuted,
        toggleAudio: () => setAudioMuted((prev) => !prev),
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error("useEmergency must be used within an EmergencyProvider");
  }
  return context;
}
