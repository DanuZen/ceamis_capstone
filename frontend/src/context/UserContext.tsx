"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface UserData {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  level: number;
  xp: number;
  streak: number;
  label: string;
  unlockedBadges: string[];
}

interface UserContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  addXp: (amount: number) => void;
  unlockBadge: (badgeId: string) => void;
}

const defaultUser: UserData = {
  name: "Danu Zen", // Default or you can leave blank
  email: "danuzen@ceamis.id",
  phone: "081234567890",
  avatarUrl: "",
  level: 1,
  xp: 0,
  streak: 1,
  label: "Pemula",
  unlockedBadges: ["First Step", "On Fire!", "Konsisten", "AI Explorer"],
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>(defaultUser);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ceamis_user");
    if (saved) {
      try {
        setUserData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("ceamis_user", JSON.stringify(userData));
    }
  }, [userData, isLoaded]);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const addXp = (amount: number) => {
    setUserData(prev => {
      const newXp = prev.xp + amount;
      const nextLevelXp = prev.level * 1000; // Example formula
      if (newXp >= nextLevelXp) {
        return {
          ...prev,
          xp: newXp - nextLevelXp,
          level: prev.level + 1,
          label: prev.level + 1 >= 5 ? "Si Hemat" : "Pemula" // Simple dynamic logic
        };
      }
      return { ...prev, xp: newXp };
    });
  };

  const unlockBadge = (badgeId: string) => {
    setUserData(prev => {
      if (!prev.unlockedBadges.includes(badgeId)) {
        return { ...prev, unlockedBadges: [...prev.unlockedBadges, badgeId] };
      }
      return prev;
    });
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, addXp, unlockBadge }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
