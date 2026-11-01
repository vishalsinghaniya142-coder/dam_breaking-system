import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  MapPin,
  Cpu,
  AlertOctagon,
  CloudRain,
  Bell,
  Siren,
  Route,
  Home,
  FileText,
  BarChart3,
  Sliders,
  Users,
  Settings as SettingsIcon,
  Info,
  Shield,
  Smartphone,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useEmergency } from "../context/EmergencyContext";
import { useAuth } from "../context/AuthContext";

export function Sidebar({ isOpen, onClose }) {
  const { t } = useLanguage();
  const { criticalAlertsCount } = useEmergency();
  const { currentUser } = useAuth();

  const navigationItems = [
    { to: "/dashboard", label: t("dashboard"), icon: LayoutDashboard, exact: true },
    { to: "/dam-monitoring", label: t("damMonitoring"), icon: Activity },
    { to: "/live-map", label: t("liveMap"), icon: MapPin },
    { to: "/flood-prediction", label: t("floodPrediction"), icon: Cpu, badge: "AI" },
    { to: "/risk-assessment", label: t("riskAssessment"), icon: AlertOctagon },
    { to: "/weather", label: t("weather"), icon: CloudRain },
    {
      to: "/alerts",
      label: t("alerts"),
      icon: Bell,
      badge: criticalAlertsCount > 0 ? `${criticalAlertsCount} Critical` : null,
      badgeColor: "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse",
    },
    { to: "/emergency-response", label: t("emergencyResponse"), icon: Siren, highlight: true },
    { to: "/safe-routes", label: t("safeRoutes"), icon: Route },
    { to: "/shelters", label: t("shelters"), icon: Home },
    { to: "/reports", label: t("reports"), icon: FileText },
    { to: "/analytics", label: t("analytics"), icon: BarChart3 },
    { to: "/manage-dams", label: t("manageDams"), icon: Sliders },
    { to: "/manage-users", label: t("manageUsers"), icon: Users },
    { to: "/settings", label: t("settings"), icon: SettingsIcon },
    { to: "/about", label: t("about"), icon: Info },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Authority Info Header */}
        <div className="p-3.5 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              National Hydro Telemetry
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-200 truncate mt-0.5">
            {currentUser?.organization || "CWC & NDMA Command"}
          </p>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-xs shadow-cyan-950"
                      : item.highlight
                      ? "text-red-300 hover:bg-red-950/40 hover:text-red-200"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      item.badgeColor || "bg-cyan-950 text-cyan-300 border border-cyan-800"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Public Portal Shortcut & SIH stamp */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <NavLink
            to="/public"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Citizen Mobile Portal</span>
          </NavLink>
          <div className="mt-2 text-[10px] text-center text-slate-400 font-mono">
            PRAVAH &bull; SIH26161 &bull; 2026
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
