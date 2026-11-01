import React, { createContext, useContext, useState, useEffect } from "react";

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem("pravah_high_contrast") === "true";
  });

  const [largeText, setLargeText] = useState(() => {
    return localStorage.getItem("pravah_large_text") === "true";
  });

  useEffect(() => {
    localStorage.setItem("pravah_high_contrast", String(highContrast));
    if (highContrast) {
      document.documentElement.classList.add("high-contrast-mode");
    } else {
      document.documentElement.classList.remove("high-contrast-mode");
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem("pravah_large_text", String(largeText));
    if (largeText) {
      document.documentElement.classList.add("large-text-mode");
    } else {
      document.documentElement.classList.remove("large-text-mode");
    }
  }, [largeText]);

  return (
    <ThemeContext.Provider
      value={{
        highContrast,
        setHighContrast,
        largeText,
        setLargeText,
        toggleHighContrast: () => setHighContrast((prev) => !prev),
        toggleLargeText: () => setLargeText((prev) => !prev),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
