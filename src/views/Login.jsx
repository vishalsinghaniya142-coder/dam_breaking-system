import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, Key, LogIn, CheckCircle2, UserCheck, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { USER_ROLES } from "../utils/constants";

export function Login() {
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const from = location.state?.from?.pathname || "/dashboard";

  const handleQuickLogin = async (role) => {
    setLocalError("");
    const roleEmails = {
      [USER_ROLES.ADMIN]: "admin@cwc.gov.in",
      [USER_ROLES.GOVT_OFFICIAL]: "collector@odisha.gov.in",
      [USER_ROLES.DISASTER_OFFICER]: "ndrf@disaster.gov.in",
      [USER_ROLES.PUBLIC_USER]: "citizen@pravah.gov.in",
    };

    const targetEmail = roleEmails[role];
    const success = await login(targetEmail, "pravah2026", role);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!email.trim()) {
      setLocalError("Please enter your official email");
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setLocalError("Authentication failed. Please verify credentials.");
    }
  };

  return (
<div className="relative min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
  <div className="fixed inset-0 z-0 overflow-hidden">
  <video
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source
      src="/images/ocean-loop-ytmp4.savetube.vip.mp4"
      type="video/mp4"
    />
  </video>

  <div className="absolute inset-0 bg-slate-950/40"></div>
</div>
      <div className="max-w-md w-full space-y-8 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        {/* Logo & Heading */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-950/60">
            <Shield className="w-7 h-7 text-slate-950" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            PRAVAH Secure Authentication
          </h2>
          <p className="text-xs text-slate-400">
            National Dam Flood Intelligence &amp; Multi-Agency Disaster Portal
          </p>
        </div>

        {/* Quick Role-Switcher Demo Pills for SIH Evaluation */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block tracking-wider text-center">
            One-Click Role Switcher (Evaluation Demo)
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin(USER_ROLES.ADMIN)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-left hover:border-cyan-500 transition-colors"
            >
              <span className="font-bold text-cyan-300 block text-xs">Admin (CWC)</span>
              <span className="text-[10px] text-slate-400">Dr. Sharma</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin(USER_ROLES.GOVT_OFFICIAL)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-left hover:border-blue-500 transition-colors"
            >
              <span className="font-bold text-blue-300 block text-xs">Govt Official</span>
              <span className="text-[10px] text-slate-400">Collector IAS</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin(USER_ROLES.DISASTER_OFFICER)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-left hover:border-amber-500 transition-colors"
            >
              <span className="font-bold text-amber-300 block text-xs">Disaster Officer</span>
              <span className="text-[10px] text-slate-400">NDRF Comdt.</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin(USER_ROLES.PUBLIC_USER)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-left hover:border-emerald-500 transition-colors"
            >
              <span className="font-bold text-emerald-300 block text-xs">Public User</span>
              <span className="text-[10px] text-slate-400">Citizen Aarav</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
          {(localError || error) && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{localError || error}</span>
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-300 mb-1">Official ID / Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., officer@cwc.gov.in"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-950 transition-all disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? "Authenticating..." : "Sign In to Disaster Command"}</span>
          </button>
        </form>

        <div className="text-center text-[10px] text-slate-500 font-mono">
          Protected by Government of India Ministry of Jal Shakti Security Protocols
        </div>
      </div>
    </div>
  );
}

export default Login;
