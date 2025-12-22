import { createContext, useContext, useState, useEffect } from "react";

/**
 * DarkModeContext - Manages dark/light mode state across the entire application
 * This context allows any component to access and toggle dark mode
 */
const DarkModeContext = createContext();

/**
 * DarkModeProvider - Wraps the app to provide dark mode functionality
 * Stores preference in localStorage for persistence
 * @param {JSX.Element} children - Child components
 */
export const DarkModeProvider = ({ children }) => {
  // Initialize dark mode state from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    // Check system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Update DOM and localStorage whenever dark mode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Toggle dark mode on/off
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

/**
 * useDarkMode - Custom hook to access dark mode context
 * @returns {Object} { isDarkMode, toggleDarkMode }
 */
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within DarkModeProvider");
  }
  return context;
};
