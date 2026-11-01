import { useEmergency } from "../context/EmergencyContext";

export function useFloodAlerts() {
  const {
    alerts,
    activeAlertsCount,
    criticalAlertsCount,
    broadcastAlert,
    acknowledgeAlert,
    dismissAlert,
    emergencyModeActive,
    toggleEmergencyMode,
  } = useEmergency();

  const criticalAlerts = alerts.filter((a) => a.severity === "CRITICAL" && a.status === "ACTIVE");
  const highAlerts = alerts.filter((a) => a.severity === "HIGH" && a.status === "ACTIVE");
  const moderateAlerts = alerts.filter((a) => a.severity === "MODERATE" && a.status === "ACTIVE");

  return {
    alerts,
    activeAlertsCount,
    criticalAlertsCount,
    criticalAlerts,
    highAlerts,
    moderateAlerts,
    broadcastAlert,
    acknowledgeAlert,
    dismissAlert,
    emergencyModeActive,
    toggleEmergencyMode,
  };
}

export default useFloodAlerts;
