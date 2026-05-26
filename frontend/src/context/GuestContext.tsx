"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type AppRole = "user" | "guest";

interface GuestContextType {
  role: AppRole;
  setRole: (role: AppRole) => void;
  isGuest: boolean;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export function GuestProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<AppRole>("user");

  useEffect(() => {
    const saved = localStorage.getItem("ceamis_role") as AppRole | null;
    if (saved === "guest" || saved === "user") setRoleState(saved);
  }, []);

  const setRole = (r: AppRole) => {
    setRoleState(r);
    localStorage.setItem("ceamis_role", r);
  };

  return (
    <GuestContext.Provider value={{ role, setRole, isGuest: role === "guest" }}>
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  const ctx = useContext(GuestContext);
  if (!ctx) throw new Error("useGuest must be used within GuestProvider");
  return ctx;
}
