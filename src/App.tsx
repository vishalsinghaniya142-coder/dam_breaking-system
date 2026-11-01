import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { EmergencyProvider } from "./context/EmergencyContext";

// Components
import { ProtectedRoute } from "./components/ProtectedRoute";
import { EmergencyBanner } from "./components/EmergencyBanner";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { FloatingAIButton } from "./components/FloatingAIButton";
import { AIChatbot } from "./components/AIChatbot";
import { VoiceAssistant } from "./components/VoiceAssistant";

// Constants
import { USER_ROLES } from "./utils/constants";

// Views
import { Dashboard } from "./views/Dashboard";
import { DamMonitoring } from "./views/DamMonitoring";
import { DamDetail } from "./views/DamDetail";
import { LiveMap } from "./views/LiveMap";
import { FloodPrediction } from "./views/FloodPrediction";
import { RiskAssessment } from "./views/RiskAssessment";
import WeatherForecast from "./views/WeatherForecast";
import { Alerts } from "./views/Alerts";
import { EmergencyResponse } from "./views/EmergencyResponse";
import { Reports } from "./views/Reports";
import { Analytics } from "./views/Analytics";
import { ManageDams } from "./views/ManageDams";
import { ManageUsers } from "./views/ManageUsers";
import { Settings } from "./views/Settings";
import { About } from "./views/About";
import { PublicPortal } from "./views/PublicPortal";
import { SafeRoutes } from "./views/SafeRoutes";
import Login from "./views/Login";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  return (
    <div
      className={`pralay-app ${
        isLoginPage
          ? "min-h-screen text-slate-100 font-sans"
          : "min-h-screen text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950"
      }`}
    >
      {/* Emergency Banner */}
      {!isLoginPage && <EmergencyBanner />}

      {/* Navbar */}
      {!isLoginPage && (
        <Navbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onOpenAI={() => setAiChatOpen(true)}
        />
      )}

      <div className={isLoginPage ? "w-full" : "flex flex-1 relative"}>
        {/* Sidebar */}
        {!isLoginPage && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main
          className={
            isLoginPage
              ? "w-full min-h-screen"
              : "pralay-main flex-1 min-w-0 transition-all duration-200 p-3 sm:p-5 lg:ml-64"
          }
        >
          <div className={isLoginPage ? "pralay-content w-full" : "pralay-content mx-auto"}>
            <Routes>

              {/* ================= PUBLIC ROUTES ================= */}

              <Route path="/login" element={<Login />} />

              <Route path="/about" element={<About />} />

              <Route path="/public" element={<PublicPortal />} />


              {/* ================= PROTECTED ROUTES ================= */}

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dam-monitoring"
                element={
                  <ProtectedRoute>
                    <DamMonitoring />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dam/:id"
                element={
                  <ProtectedRoute>
                    <DamDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/live-map"
                element={
                  <ProtectedRoute>
                    <LiveMap />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/safe-routes"
                element={
                  <ProtectedRoute>
                    <SafeRoutes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/flood-prediction"
                element={
                  <ProtectedRoute>
                    <FloodPrediction />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/risk-assessment"
                element={
                  <ProtectedRoute>
                    <RiskAssessment />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/weather"
                element={
                  <ProtectedRoute>
                    <WeatherForecast />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/alerts"
                element={
                  <ProtectedRoute>
                    <Alerts />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/emergency-response"
                element={
                  <ProtectedRoute>
                    <EmergencyResponse />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />


              {/* ================= ADMIN ROUTES ================= */}

              <Route
                path="/manage-dams"
                element={
                  <ProtectedRoute
                    allowedRoles={["admin", "govt_official"]}
                  >
                    <ManageDams />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/manage-users"
                element={
                  <ProtectedRoute
                   allowedRoles={["admin"]}
                  >
                    <ManageUsers />
                  </ProtectedRoute>
                }
              />


              {/* ================= DEFAULT ================= */}

              <Route
                path="/"
                element={<Navigate to="/login" replace />}
              />

              <Route
                path="*"
                element={<Navigate to="/login" replace />}
              />

            </Routes>
          </div>
        </main>
      </div>


      {/* ================= GLOBAL AI FEATURES ================= */}

      {!isLoginPage && (
        <>
          <FloatingAIButton
            isOpen={aiChatOpen}
            onClick={() => setAiChatOpen((prev) => !prev)}
          />

          <AIChatbot
            isOpen={aiChatOpen}
            onClose={() => setAiChatOpen(false)}
          />

          <VoiceAssistant />
        </>
      )}
    </div>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <EmergencyProvider>
              <AppLayout />
            </EmergencyProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}