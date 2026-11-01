/**
 * Calculate distance between two coordinates in kilometers (Haversine Formula)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

export function formatNumber(num) {
  if (num === undefined || num === null) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
}

export function formatTimeAgo(timestamp) {
  if (!timestamp) return "Just now";
  const date = new Date(timestamp);
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return `${Math.max(1, seconds)}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function getRiskColorClass(riskLevel) {
  switch (riskLevel?.toUpperCase()) {
    case "CRITICAL":
      return "text-red-400 bg-red-500/10 border-red-500/30 ring-1 ring-red-500/50";
    case "HIGH":
      return "text-orange-400 bg-orange-500/10 border-orange-500/30";
    case "MODERATE":
      return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    case "LOW":
      return "text-sky-400 bg-sky-500/10 border-sky-500/30";
    case "NORMAL":
    default:
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  }
}
