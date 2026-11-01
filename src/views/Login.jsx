import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  ArrowDown,
  BrainCircuit,
  Droplets,
  LogIn,
  Radio,
  Shield,
  Waves,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { USER_ROLES } from "../utils/constants";

export function Login() {
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const loginCardRef = useRef(null);
  const emailInputRef = useRef(null);

  const from = location.state?.from?.pathname || "/dashboard";

  const features = [
    { label: "Live Monitoring", detail: "Dam & river telemetry", icon: Activity },
    { label: "Breach Simulation", detail: "Flood propagation insights", icon: Waves },
    { label: "AI Risk Assessment", detail: "Forecasts for downstream areas", icon: BrainCircuit },
    { label: "Emergency Alerts", detail: "Timely warnings & updates", icon: Radio },
  ];

  const focusSignIn = () => {
    loginCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    emailInputRef.current?.focus({ preventScroll: true });
  };

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
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/images/ocean-loop-ytmp4.savetube.vip.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(5, 8, 14, 0.68) 0%, rgba(5, 8, 14, 0.48) 48%, rgba(5, 8, 14, 0.68) 100%)",
          }}
        />
      </div>

      <main className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1440px] grid-cols-1 items-center gap-10 px-4 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.82fr)] lg:gap-14 lg:px-14">
        <section className="mx-auto w-full max-w-2xl space-y-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/30 bg-slate-950/60 shadow-lg shadow-cyan-950/40 backdrop-blur">
              <Droplets className="h-6 w-6 text-cyan-300" />
            </div>
            <div>
              <p className="text-lg font-black tracking-[0.18em] text-white">PRALAY</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100/70">
                Dam safety intelligence
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-950/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-200 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Predict. Protect. Prepare.
            </div>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Real-Time Dam Safety &amp;{" "}
              <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-emerald-200 bg-clip-text text-transparent">
                Flood Early Warning
              </span>
            </h1>
            <p className="max-w-xl text-sm leading-7 text-slate-200 sm:text-base">
              Monitor reservoir conditions, understand downstream flood risk, and bring critical
              information together for faster, better-informed decisions.
            </p>
          </div>

          <div className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
            {features.map(({ label, detail, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/45 p-3.5 shadow-lg backdrop-blur-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10">
                  <Icon className="h-5 w-5 text-cyan-200" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold text-white">{label}</span>
                  <span className="mt-0.5 block text-[10px] leading-4 text-slate-300">{detail}</span>
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={focusSignIn}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-200/30 bg-cyan-300 px-5 py-3 text-xs font-extrabold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5 hover:bg-cyan-200 focus-visible:outline-cyan-100"
          >
            Access the Command Center
            <ArrowDown className="h-4 w-4" />
          </button>
        </section>

        <section
          ref={loginCardRef}
          className="mx-auto w-full max-w-md space-y-6 rounded-3xl border p-6 shadow-2xl backdrop-blur-2xl sm:p-8"
          style={{
            background: "rgba(15, 13, 18, 0.76)",
            borderColor: "rgba(255, 255, 255, 0.16)",
            boxShadow: "0 24px 80px rgba(0, 0, 0, 0.45)",
          }}
        >
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-700 shadow-lg shadow-red-950/40">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
              PRALAY Secure Authentication
            </h2>
            <p className="mt-2 text-xs leading-5 text-slate-300">
              National Dam Flood Intelligence &amp; Multi-Agency Disaster Portal
            </p>
          </div>

          <div className="space-y-2 rounded-2xl border border-white/10 bg-black/25 p-3.5">
            <span className="block text-center text-[10px] font-bold uppercase tracking-wider text-cyan-200">
              One-Click Role Switcher (Evaluation Demo)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin(USER_ROLES.ADMIN)}
                className="rounded-xl border border-white/10 bg-slate-950/55 p-2.5 text-left text-slate-200 transition-colors hover:border-cyan-400/60 hover:bg-slate-900/80"
              >
                <span className="block text-xs font-bold text-cyan-200">Admin (CWC)</span>
                <span className="text-[10px] text-slate-400">Dr. Sharma</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin(USER_ROLES.GOVT_OFFICIAL)}
                className="rounded-xl border border-white/10 bg-slate-950/55 p-2.5 text-left text-slate-200 transition-colors hover:border-sky-400/60 hover:bg-slate-900/80"
              >
                <span className="block text-xs font-bold text-sky-200">Govt Official</span>
                <span className="text-[10px] text-slate-400">Collector IAS</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin(USER_ROLES.DISASTER_OFFICER)}
                className="rounded-xl border border-white/10 bg-slate-950/55 p-2.5 text-left text-slate-200 transition-colors hover:border-amber-400/60 hover:bg-slate-900/80"
              >
                <span className="block text-xs font-bold text-amber-200">Disaster Officer</span>
                <span className="text-[10px] text-slate-400">NDRF Comdt.</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin(USER_ROLES.PUBLIC_USER)}
                className="rounded-xl border border-white/10 bg-slate-950/55 p-2.5 text-left text-slate-200 transition-colors hover:border-emerald-400/60 hover:bg-slate-900/80"
              >
                <span className="block text-xs font-bold text-emerald-200">Public User</span>
                <span className="text-[10px] text-slate-400">Citizen Aarav</span>
              </button>
            </div>
          </div>

          <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
            {(localError || error) && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/50 bg-red-950/60 p-3 text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{localError || error}</span>
              </div>
            )}

            <div>
              <label htmlFor="official-email" className="mb-1 block font-medium text-slate-200">
                Official ID / Email
              </label>
              <input
                ref={emailInputRef}
                id="official-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., officer@cwc.gov.in"
                className="w-full rounded-xl border border-white/15 bg-black/35 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="official-password" className="mb-1 block font-medium text-slate-200">
                Password
              </label>
              <input
                id="official-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/15 bg-black/35 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-700 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-red-950/40 transition-all hover:brightness-110 disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" />
              <span>{loading ? "Authenticating..." : "Sign In to Disaster Command"}</span>
            </button>
          </form>

          <div className="text-center font-mono text-[10px] leading-4 text-slate-400">
            Protected by Government of India Ministry of Jal Shakti Security Protocols
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;
