import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  Siren,
  Plus,
  Filter,
  CheckCircle2,
  Volume2,
  Send,
  X,
  ShieldAlert,
} from "lucide-react";
import { useEmergency } from "../context/EmergencyContext";
import { useAuth } from "../context/AuthContext";
import { AlertCard } from "../components/AlertCard";
import { USER_ROLES } from "../utils/constants";
import { DAMS_DATA } from "../data/damData";

export function Alerts() {
  const { alerts, broadcastAlert, acknowledgeAlert, criticalAlertsCount } = useEmergency();
  const { currentUser } = useAuth();
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  // New Alert Form state
  const [newTitle, setNewTitle] = useState("");
  const [newSeverity, setNewSeverity] = useState("CRITICAL");
  const [newCategory, setNewCategory] = useState("DAM_DISCHARGE");
  const [newDesc, setNewDesc] = useState("");
  const [newAction, setNewAction] = useState("");
  const [newLocation, setNewLocation] = useState("Hirakud Downstream, Sambalpur");

  const canBroadcast =
    currentUser?.role === USER_ROLES.ADMIN ||
    currentUser?.role === USER_ROLES.GOVT_OFFICIAL ||
    currentUser?.role === USER_ROLES.DISASTER_OFFICER;

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity === "ALL") return true;
    if (filterSeverity === "ACKNOWLEDGED") return a.status === "ACKNOWLEDGED";
    return a.severity === filterSeverity && a.status === "ACTIVE";
  });

  const handleBroadcastSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    broadcastAlert({
      title: newTitle,
      severity: newSeverity,
      category: newCategory,
      description: newDesc,
      recommendedAction: newAction,
      location: newLocation,
      issuedBy: `${currentUser?.name} (${currentUser?.organization || "National Command"})`,
    });

    setNewTitle("");
    setNewDesc("");
    setNewAction("");
    setShowBroadcastModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-400" />
            <h1 className="text-xl font-black text-white font-sans">
              Emergency Flood Bulletins &amp; Alerts Dispatch
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Public warnings, dam spillway opening notifications, and NDMA multi-agency broadcasts.
          </p>
        </div>

        {canBroadcast && (
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg shadow-md shadow-red-950 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Broadcast Emergency Bulletin</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { key: "ALL", label: `All Alerts (${alerts.length})` },
          { key: "CRITICAL", label: `Critical (${alerts.filter((a) => a.severity === "CRITICAL" && a.status === "ACTIVE").length})`, color: "text-red-400" },
          { key: "HIGH", label: `High (${alerts.filter((a) => a.severity === "HIGH" && a.status === "ACTIVE").length})`, color: "text-orange-400" },
          { key: "MODERATE", label: `Moderate (${alerts.filter((a) => a.severity === "MODERATE" && a.status === "ACTIVE").length})`, color: "text-amber-400" },
          { key: "ACKNOWLEDGED", label: `Acknowledged (${alerts.filter((a) => a.status === "ACKNOWLEDGED").length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterSeverity(tab.key)}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-colors shrink-0 ${
              filterSeverity === tab.key
                ? "bg-slate-800 text-white border-slate-600 shadow-xs font-bold"
                : "bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800/60"
            } ${tab.color || ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onAcknowledge={acknowledgeAlert}
          />
        ))}

        {filteredAlerts.length === 0 && (
          <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
            No alerts matching current filter.
          </div>
        )}
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <Siren className="w-4 h-4 animate-pulse" />
                <span>Issue Multi-Agency Public Alert</span>
              </div>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Alert Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., EMERGENCY: Hirakud 28 Sluice Gates Opening - Evacuate Riverbank"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Severity Level</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="CRITICAL">Critical (Code Red)</option>
                    <option value="HIGH">High (Orange Alert)</option>
                    <option value="MODERATE">Moderate (Yellow Watch)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="DAM_DISCHARGE">Dam Discharge</option>
                    <option value="FLASH_FLOOD">Flash Flood</option>
                    <option value="CLOUDBURST">Cloudburst</option>
                    <option value="EVACUATION">Evacuation Order</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Affected Location / Wards</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Detailed Bulletin</label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Explain water surge volume, arrival timeline, and designated safe routes..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Recommended Citizen Action</label>
                <input
                  type="text"
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  placeholder="Move immediately to GM University / Govt High School relief shelter."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-md shadow-red-950"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Alerts;
