import { createContext, useState, useContext } from "react";

// Create context with a default value
export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

// Custom hook for easy consumption across the app
export const useTheme = () => useContext(ThemeContext);

// Provider wraps the entire application
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("inventoryTheme") || "light";
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("inventoryTheme", next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === "dark" ? "dark" : ""}>{children}</div>
    </ThemeContext.Provider>
  );
}
