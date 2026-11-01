import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  Search,
  Sparkles,
  Shield,
  Siren,
  Globe,
  User,
  LogOut,
  ChevronDown,
  Volume2,
  Eye,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useEmergency } from "../context/EmergencyContext";
import { useTheme } from "../context/ThemeContext";
import { USER_ROLES } from "../utils/constants";

export function Navbar({ onToggleSidebar, onOpenAI }) {
  const { currentUser, logout, switchRole } = useAuth();
  const { currentLanguage, setLanguage, languages, activeLangObj, t } = useLanguage();
  const { emergencyModeActive, toggleEmergencyMode, activeAlertsCount } = useEmergency();
  const { highContrast, toggleHighContrast } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/dam-monitoring?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
        {/* Left: Mobile Toggle + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 lg:hidden focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center p-1.5 shadow-md shadow-cyan-900/30 group-hover:ring-2 group-hover:ring-cyan-400 transition-all">
              <Shield className="w-full h-full text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-wider text-white font-sans">
                  PRAVAH
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">
                  SIH26161
                </span>
              </div>
              <p className="text-[10px] text-cyan-300/80 -mt-0.5 tracking-tight hidden sm:block">
                Flood Intelligence Command
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <form onSubmit={handleSearch} className="w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </form>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* High Contrast Accessibility Toggle */}
          <button
            onClick={toggleHighContrast}
            title={highContrast ? "Standard Dark Theme" : "High Contrast Mode (Accessibility)"}
            className={`p-2 rounded-lg border text-xs flex items-center transition-colors ${
              highContrast
                ? "bg-amber-500 text-slate-950 border-amber-400 font-bold"
                : "border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-xs text-slate-200"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline font-medium">{activeLangObj.nativeName}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1.5 z-50 max-h-72 overflow-y-auto">
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Select Language (12 Indian Languages)
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                      currentLanguage === lang.code
                        ? "text-cyan-400 font-bold bg-slate-800/50"
                        : "text-slate-300"
                    }`}
                  >
                    <span>{lang.nativeName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Alerts Notification Button */}
          <Link
            to="/alerts"
            className="relative p-2 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-800 border border-slate-700/60 transition-colors"
            title="Alerts"
          >
            <Bell className="w-4 h-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-slate-900">
                {activeAlertsCount}
              </span>
            )}
          </Link>

          {/* AI Assistant Quick Trigger */}
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/60 transition-colors text-xs font-semibold shadow-sm shadow-cyan-950"
            title="Ask PRAVAH AI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="hidden md:inline">AI Assist</span>
          </button>

          {/* Emergency Code Red Toggle Button */}
          <button
            onClick={toggleEmergencyMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              emergencyModeActive
                ? "bg-red-600 hover:bg-red-500 text-white animate-pulse ring-2 ring-red-400 shadow-lg shadow-red-900/50"
                : "bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-700/50"
            }`}
            title="Toggle National Emergency Protocol"
          >
            <Siren className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {emergencyModeActive ? "CODE RED ACTIVE" : "EMERGENCY"}
            </span>
          </button>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-slate-700 border border-cyan-500/50 flex items-center justify-center text-xs font-bold text-cyan-300 font-mono">
                {currentUser?.avatar || "U"}
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-slate-200">
                <div className="px-4 py-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
                  <p className="text-[11px] text-cyan-400 truncate">{currentUser?.role}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{currentUser?.organization}</p>
                </div>

                <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Authority View
                </div>

                {Object.values(USER_ROLES).map((roleName) => (
                  <button
                    key={roleName}
                    onClick={() => {
                      switchRole(roleName);
                      setShowUserMenu(false);
                      if (roleName === USER_ROLES.PUBLIC_USER) {
                        navigate("/public");
                      }
                    }}
                    className={`w-full text-left px-4 py-1.5 text-xs hover:bg-slate-800 transition-colors flex items-center justify-between ${
                      currentUser?.role === roleName ? "text-cyan-400 font-bold bg-slate-800/40" : "text-slate-300"
                    }`}
                  >
                    <span>{roleName}</span>
                    {currentUser?.role === roleName && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    )}
                  </button>
                ))}

                <div className="border-t border-slate-800 mt-2 pt-1">
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full text-left px-4 py-1.5 text-xs hover:bg-slate-800 text-slate-300 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Settings &amp; Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                      navigate("/login");
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs hover:bg-red-950/60 text-red-400 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
