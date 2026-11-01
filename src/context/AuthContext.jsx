import React, { createContext, useContext, useState, useEffect } from "react";
import { USER_ROLES } from "../utils/constants";

export const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: "usr-01",
  name: "Dr. Vikramaditya Sharma",
  email: "admin@pravah.gov.in",
  role: USER_ROLES.ADMIN,
  organization: "Central Water Commission (CWC) & NDMA",
  phone: "+91-98765-43210",
  avatar: "VS",
  state: "National Command",
  designation: "Chief Hydrological Safety Director",
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("pravah_user");
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("pravah_user", JSON.stringify(currentUser));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("pravah_user");
      setIsAuthenticated(false);
    }
  }, [currentUser]);

  const login = async (email, password, role = USER_ROLES.ADMIN) => {
    // Structured demo login with simulated validation
    let userName = "Officer Sharma";
    let org = "National Disaster Management Authority";

    if (email.includes("ndrf")) {
      userName = "Commandant Rajiv Verma";
      org = "NDRF 3rd Battalion Disaster Command";
      role = USER_ROLES.DISASTER_OFFICER;
    } else if (email.includes("public") || role === USER_ROLES.PUBLIC_USER) {
      userName = "Aarav Patel (Citizen)";
      org = "General Public Safety Portal";
      role = USER_ROLES.PUBLIC_USER;
    } else if (role === USER_ROLES.RESEARCHER) {
      userName = "Prof. Meenakshi Sundaram";
      org = "IIT Roorkee Water Resources Dept";
    }

    const user = {
      id: `usr-${Date.now()}`,
      name: userName,
      email: email || "officer@pravah.gov.in",
      role,
      organization: org,
      phone: "+91-98111-22334",
      avatar: userName.slice(0, 2).toUpperCase(),
      state: "Odisha / Uttarakhand Command",
    };

    setCurrentUser(user);
    return { success: true, user };
  };

  const register = async (userData) => {
    const user = {
      id: `usr-${Date.now()}`,
      name: userData.fullName || "Registered Official",
      email: userData.email,
      phone: userData.mobile,
      role: userData.userType || USER_ROLES.PUBLIC_USER,
      organization: userData.organization || "Public Safety Network",
      avatar: (userData.fullName || "User").slice(0, 2).toUpperCase(),
      state: userData.state || "National",
    };
    setCurrentUser(user);
    return { success: true, user };
  };

  const switchRole = (newRole) => {
    if (currentUser) {
      const updated = {
        ...currentUser,
        role: newRole,
        organization:
          newRole === USER_ROLES.PUBLIC_USER
            ? "Citizen Portal"
            : "Central Water Commission & NDMA",
      };
      setCurrentUser(updated);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
