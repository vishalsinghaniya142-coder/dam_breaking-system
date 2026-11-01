import React, { useState } from "react";
import { Users, UserPlus, Shield, Check, X, ShieldAlert, Key } from "lucide-react";
import { USER_ROLES } from "../utils/constants";

export function ManageUsers() {
  const [usersList, setUsersList] = useState([
    {
      id: "u-1",
      name: "Dr. Rajeshwar Sharma",
      email: "r.sharma@cwc.gov.in",
      role: USER_ROLES.ADMIN,
      organization: "Central Water Commission, New Delhi",
      status: "ACTIVE",
    },
    {
      id: "u-2",
      name: "Smt. Ananya Senapati, IAS",
      email: "collector-sambalpur@odisha.gov.in",
      role: USER_ROLES.GOVT_OFFICIAL,
      organization: "District Administration Sambalpur",
      status: "ACTIVE",
    },
    {
      id: "u-3",
      name: "Commandant Vikram Rathore",
      email: "vikram.ndrf3@gov.in",
      role: USER_ROLES.DISASTER_OFFICER,
      organization: "NDRF 3rd Battalion, Cuttack",
      status: "ACTIVE",
    },
    {
      id: "u-4",
      name: "Aarav Mishra",
      email: "aarav.citizen@gmail.com",
      role: USER_ROLES.PUBLIC_USER,
      organization: "Resident of Sambalpur Ward 4",
      status: "ACTIVE",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState(USER_ROLES.DISASTER_OFFICER);
  const [newOrg, setNewOrg] = useState("");

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    setUsersList([
      ...usersList,
      {
        id: `u-${Date.now()}`,
        name: newName,
        email: newEmail,
        role: newRole,
        organization: newOrg || "Disaster Response Wing",
        status: "ACTIVE",
      },
    ]);

    setNewName("");
    setNewEmail("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-black text-white font-sans">
              Access Control &amp; Disaster Personnel Directory
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Role-Based Access Control (RBAC) across National, State, and District emergency teams.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision Official Account</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 font-mono text-slate-400 uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Official Name</th>
                <th className="p-3">Designated Role</th>
                <th className="p-3">Agency / Department</th>
                <th className="p-3">Official Email</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {usersList.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs text-cyan-300">
                      {user.name.charAt(0)}
                    </div>
                    <span>{user.name}</span>
                  </td>
                  <td className="p-3 font-mono">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{user.organization}</td>
                  <td className="p-3 font-mono text-slate-400">{user.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-100 uppercase font-mono tracking-wider">
          Authority Permission Capabilities Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 divide-y divide-slate-800">
            <thead className="bg-slate-950 font-mono text-slate-400">
              <tr>
                <th className="p-2.5">System Capability</th>
                <th className="p-2.5">Admin</th>
                <th className="p-2.5">Govt Official</th>
                <th className="p-2.5">Disaster Officer</th>
                <th className="p-2.5">Public User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              <tr>
                <td className="p-2.5 font-sans">View Live Telemetry &amp; Maps</td>
                <td className="p-2.5 text-emerald-400">Granted</td>
                <td className="p-2.5 text-emerald-400">Granted</td>
                <td className="p-2.5 text-emerald-400">Granted</td>
                <td className="p-2.5 text-emerald-400">Granted</td>
              </tr>
              <tr>
                <td className="p-2.5 font-sans">Broadcast Emergency Bulletins</td>
                <td className="p-2.5 text-emerald-400">Granted</td>
                <td className="p-2.5 text-emerald-400">Granted</td>
                <td className="p-2.5 text-emerald-400">Granted</td>
                <td className="p-2.5 text-red-400">Restricted</td>
              </tr>
              <tr>
                <td className="p-2.5 font-sans">Sluice Gate Aperture Override</td>
                <td className="p-2.5 text-emerald-400">Granted</td>
                <td className="p-2.5 text-emerald-400">Granted</td>
                <td className="p-2.5 text-red-400">Restricted</td>
                <td className="p-2.5 text-red-400">Restricted</td>
              </tr>
              <tr>
                <td className="p-2.5 font-sans">Delft3D AI Breach Simulation</td>
                <td className="p-2.5 text-emerald-400">Granted</td>
                <td className="p-2.5 text-emerald-400">Granted</td>
                <td className="p-2.5 text-emerald-400">Granted</td>
                <td className="p-2.5 text-emerald-400">Read-Only</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Provision Official Account</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Official Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Major Sandeep Roy"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Government / Official Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g., s.roy@nic.in"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Role Permission</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white"
                >
                  {Object.values(USER_ROLES).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Agency / Department</label>
                <input
                  type="text"
                  value={newOrg}
                  onChange={(e) => setNewOrg(e.target.value)}
                  placeholder="e.g., State Emergency Operation Center"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white"
                />
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
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Provision Official</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
