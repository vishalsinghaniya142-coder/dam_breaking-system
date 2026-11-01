import React, { useState } from "react";
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  Activity,
  Save,
} from "lucide-react";
import { DAMS_DATA } from "../data/damData";
import { damService } from "../services/damService";
import { getRiskColorClass } from "../utils/helpers";

export function ManageDams() {
  const [damsList, setDamsList] = useState(DAMS_DATA);
  const [editingDam, setEditingDam] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Dam Form state
  const [newDam, setNewDam] = useState({
    name: "",
    river: "",
    state: "Odisha",
    cwcCode: "CWC-NEW-01",
    currentWaterLevel: 180,
    fullReservoirLevel: 195,
    dangerLevel: 192,
    warningLevel: 188,
    inflow: 2500,
    outflow: 2000,
    gatesOpen: 12,
    totalGates: 36,
    riskLevel: "MODERATE",
    lat: 21.5,
    lng: 83.9,
    structuralHealth: "Piezometers Online",
  });

  const handleEditSave = (e) => {
    e.preventDefault();
    if (!editingDam) return;

    setDamsList((prev) =>
      prev.map((d) => (d.id === editingDam.id ? editingDam : d))
    );
    setEditingDam(null);
  };

  const handleAddNew = (e) => {
    e.preventDefault();
    if (!newDam.name.trim()) return;

    const storagePercentage = Math.round(
      (newDam.currentWaterLevel / newDam.fullReservoirLevel) * 100
    );

    const created = {
      ...newDam,
      id: `dam-${Date.now()}`,
      storagePercentage,
    };

    setDamsList([created, ...damsList]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-black text-white font-sans">
              Dam Fleet Telemetry Configuration
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure CWC telemetry station endpoints, reservoir rule curve limits, and spillway gate sensors.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Dam Station</span>
        </button>
      </div>

      {/* Dam Fleet Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 font-mono text-slate-400 uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Dam Name</th>
                <th className="p-3">River / State</th>
                <th className="p-3">Water Level</th>
                <th className="p-3">Storage %</th>
                <th className="p-3">Inflow / Outflow</th>
                <th className="p-3">Gates</th>
                <th className="p-3">Risk</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              {damsList.map((dam) => (
                <tr key={dam.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white font-sans">{dam.name}</td>
                  <td className="p-3 text-slate-400">{dam.river} &bull; {dam.state}</td>
                  <td className="p-3 font-bold text-cyan-300">{dam.currentWaterLevel}m</td>
                  <td className="p-3">{dam.storagePercentage}%</td>
                  <td className="p-3">
                    <span className="text-blue-400">{dam.inflow}</span> /{" "}
                    <span className="text-orange-400">{dam.outflow}</span>
                  </td>
                  <td className="p-3">{dam.gatesOpen} / {dam.totalGates}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getRiskColorClass(dam.riskLevel)}`}>
                      {dam.riskLevel}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setEditingDam(dam)}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
                      title="Edit Telemetry"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Dam Modal */}
      {editingDam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Edit Dam Telemetry: {editingDam.name}</h3>
              <button onClick={() => setEditingDam(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Water Level (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editingDam.currentWaterLevel}
                  onChange={(e) =>
                    setEditingDam({ ...editingDam, currentWaterLevel: Number(e.target.value) })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Inflow (cumecs)</label>
                  <input
                    type="number"
                    value={editingDam.inflow}
                    onChange={(e) =>
                      setEditingDam({ ...editingDam, inflow: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Outflow (cumecs)</label>
                  <input
                    type="number"
                    value={editingDam.outflow}
                    onChange={(e) =>
                      setEditingDam({ ...editingDam, outflow: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Gates Open</label>
                  <input
                    type="number"
                    value={editingDam.gatesOpen}
                    onChange={(e) =>
                      setEditingDam({ ...editingDam, gatesOpen: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Risk Level</label>
                  <select
                    value={editingDam.riskLevel}
                    onChange={(e) =>
                      setEditingDam({ ...editingDam, riskLevel: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingDam(null)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Telemetry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Dam Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Register New Dam Station</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNew} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Dam Name</label>
                <input
                  type="text"
                  required
                  value={newDam.name}
                  onChange={(e) => setNewDam({ ...newDam, name: e.target.value })}
                  placeholder="e.g., Koyna Dam"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">River</label>
                  <input
                    type="text"
                    required
                    value={newDam.river}
                    onChange={(e) => setNewDam({ ...newDam, river: e.target.value })}
                    placeholder="e.g., Koyna River"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={newDam.state}
                    onChange={(e) => setNewDam({ ...newDam, state: e.target.value })}
                    placeholder="e.g., Maharashtra"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Water Level (m)</label>
                  <input
                    type="number"
                    value={newDam.currentWaterLevel}
                    onChange={(e) => setNewDam({ ...newDam, currentWaterLevel: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Danger Mark (m)</label>
                  <input
                    type="number"
                    value={newDam.dangerLevel}
                    onChange={(e) => setNewDam({ ...newDam, dangerLevel: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">FRL (m)</label>
                  <input
                    type="number"
                    value={newDam.fullReservoirLevel}
                    onChange={(e) => setNewDam({ ...newDam, fullReservoirLevel: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Station</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDams;
