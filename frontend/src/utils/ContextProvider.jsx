import { createContext, useContext, useEffect, useState } from "react";

const CureitContext = createContext();

export function useCureitContext() {
  const context = useContext(CureitContext);
  if (!context) {
    throw new Error("useCureitContext must be used within a CureitProvider");
  }
  return context;
}

export default function CureitProvider({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      setTheme(theme);
    }
  }, []);

  return (
    <CureitContext.Provider value={{ theme, setTheme }}>
      {children}
    </CureitContext.Provider>
  );
}
