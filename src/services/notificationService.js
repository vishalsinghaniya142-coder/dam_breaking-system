import { playEmergencyAlertSound, speakAlert } from "../utils/emergencyUtils";

export const notificationService = {
  async requestPermission() {
    if (typeof window !== "undefined" && "Notification" in window) {
      return await Notification.requestPermission();
    }
    return "denied";
  },

  sendNotification(title, options = {}) {
    // Play alert sound if critical
    if (options.severity === "CRITICAL" || options.severity === "HIGH") {
      playEmergencyAlertSound();
    }

    if (options.readAloud) {
      speakAlert(`${title}. ${options.body || ""}`);
    }

    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, {
          icon: "/images/logo.svg",
          badge: "/images/logo.svg",
          ...options,
        });
      } catch (e) {
        console.warn("Desktop notification dispatch error:", e);
      }
    }
  },
};
