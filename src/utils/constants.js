export const APP_NAME = "PRAVAH";
export const APP_TAGLINE = "Predict. Protect. Prepare.";
export const SIH_PROBLEM_CODE = "SIH26161";

export const USER_ROLES = {
  ADMIN: "Administrator",
  GOVT_OFFICIAL: "Government Official",
  DISASTER_OFFICER: "Disaster Management Officer",
  PUBLIC_USER: "Public User",
  RESEARCHER: "Researcher",
};

export const RISK_LEVELS = {
  NORMAL: {
    label: "Normal",
    code: "NORMAL",
    color: "emerald",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    scoreRange: [0, 20],
    description: "Water levels within safe operational limits. Normal telemetry monitoring.",
  },
  LOW: {
    label: "Low Risk",
    code: "LOW",
    color: "sky",
    badgeBg: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    scoreRange: [21, 40],
    description: "Minor inflow surge detected. Reservoir spillways regulated as per rule curve.",
  },
  MODERATE: {
    label: "Moderate Risk",
    code: "MODERATE",
    color: "amber",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    scoreRange: [41, 70],
    description: "Reservoir capacity approaching 85%. Downstream district warnings active.",
  },
  HIGH: {
    label: "High Alert",
    code: "HIGH",
    color: "orange",
    badgeBg: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    scoreRange: [71, 85],
    description: "Severe inflow, spillway gates opened at high discharge. Evacuation readiness alerted.",
  },
  CRITICAL: {
    label: "Critical Breach Threat",
    code: "CRITICAL",
    color: "red",
    badgeBg: "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse",
    scoreRange: [86, 100],
    description: "Imminent dam overtopping or structural distress. Immediate evacuation protocol active.",
  },
};

export const EMERGENCY_CONTACTS = [
  { name: "National Disaster Response Force (NDRF)", number: "1078", tollFree: true },
  { name: "Central Emergency Operation Centre (NDMA)", number: "011-26701728" },
  { name: "Central Water Commission (Flood Cell)", number: "1800-180-1551" },
  { name: "National Disaster Helpline", number: "112", tollFree: true },
  { name: "State Disaster Management Authority (SDMA)", number: "1070" },
  { name: "Medical & Ambulance Emergency", number: "108", tollFree: true },
];

export const MAP_CENTER_INDIA = [22.5937, 78.9629];
export const DEFAULT_MAP_ZOOM = 5;
