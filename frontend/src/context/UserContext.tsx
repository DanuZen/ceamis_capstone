"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { usersApi, UserProfile as ApiUserProfile } from "@/lib/api";

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  level: number;
  xp: number;
  streak: number;
  label: string;
  unlockedBadges: string[];
  /** Skor kesehatan finansial dari Model 1 (0–100) */
  healthScore: number;
  /** True jika healthScore < 40 → Warning System diaktifkan */
  warningTriggered: boolean;
  riskProfile?: string;
  onboardingCompleted: boolean;
}

interface UserContextType {
  userData: UserData;
  isLoadingUser: boolean;
  updateUserData: (data: Partial<UserData>) => void;
  addXp: (amount: number) => Promise<void>;
  unlockBadge: (badgeId: string) => void;
  setHealthScore: (score: number, triggered: boolean) => void;
  refreshUser: () => Promise<void>;
}

const defaultUser: UserData = {
  id: "",
  name: "User",
  email: "",
  phone: "",
  avatarUrl: "",
  level: 1,
  xp: 0,
  streak: 0,
  label: "Pemula",
  unlockedBadges: [],
  healthScore: 75,
  warningTriggered: false,
  onboardingCompleted: false,
};

// Map API profile → local UserData
const mapApiToUserData = (profile: ApiUserProfile): UserData => ({
  id: profile.id,
  name: profile.name || "User",
  email: profile.email || "",
  phone: profile.phone || "",
  avatarUrl: profile.avatar_url || "",
  level: profile.level,
  xp: profile.xp,
  streak: profile.streak,
  label: profile.label,
  unlockedBadges: profile.unlocked_badges || [],
  healthScore: Number(profile.health_score),
  warningTriggered: profile.warning_triggered,
  riskProfile: profile.risk_profile,
  onboardingCompleted: profile.onboarding_completed,
});

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [userData, setUserData] = useState<UserData>(defaultUser);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const refreshUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // User tidak login → clear semua data dan reset ke default
      localStorage.removeItem("ceamis_user");
      setUserData(defaultUser);
      setIsLoadingUser(false);
      return;
    }

    // Cek apakah localStorage milik user yang sama
    const savedRaw = localStorage.getItem("ceamis_user");
    let savedData: UserData | null = null;
    if (savedRaw) {
      try {
        const parsed = JSON.parse(savedRaw);
        // Hanya pakai jika ID cocok dengan user yang login sekarang
        if (parsed.id === user.id) {
          savedData = parsed;
        } else {
          // User berbeda → hapus cache lama
          localStorage.removeItem("ceamis_user");
        }
      } catch {
        localStorage.removeItem("ceamis_user");
      }
    }

    try {
      const profile = await usersApi.getProfile(user.id);
      const mapped = mapApiToUserData(profile);
      
      // Fix for Issue 1: user_profiles table doesn't have an email column, so fallback to auth user data.
      if (!mapped.email && user.email) {
        mapped.email = user.email;
      }
      if (mapped.name === "User" && (user.user_metadata?.full_name || user.email)) {
        mapped.name = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
      }

      // Merge API badges with any locally persisted badges to avoid race-condition overwrite
      const localRaw = localStorage.getItem("ceamis_user");
      if (localRaw) {
        try {
          const local = JSON.parse(localRaw);
          if (local.id === user.id) {
            // Remove badge merge (union) to prevent deleted badges from resurrecting
            // Always trust DB unlockedBadges so it stays in sync with admin deletions
            /* if (Array.isArray(local.unlockedBadges)) {
              const merged = Array.from(new Set([...mapped.unlockedBadges, ...local.unlockedBadges]));
              mapped.unlockedBadges = merged;
            } */
            // Take the higher XP/level (local may have unsync'd gains)
            if (typeof local.xp === "number" && typeof local.level === "number") {
              const localTotal = local.level * 1000 + local.xp;
              const apiTotal = mapped.level * 1000 + mapped.xp;
              if (localTotal > apiTotal) {
                mapped.xp = local.xp;
                mapped.level = local.level;
              }
            }
            // Preserve AI-generated cluster label from localStorage.
            // We check against all known AI-generated cluster labels, not just non-default ones,
            // to prevent the DB "Pemula" value from overwriting a valid cluster label.
            const CLUSTER_LABELS = ["Si Impulsif", "Si Hemat", "Si Boros"];
            if (local.label && (CLUSTER_LABELS.includes(local.label) || local.label !== defaultUser.label)) {
              mapped.label = local.label;
            }
            // Preserve avatarUrl if API doesn't have it or we want local priority
            if (local.avatarUrl) {
              mapped.avatarUrl = local.avatarUrl;
            }
          }
        } catch { /* ignore */ }
      }

      // Preserve avatar photo: dedicated cache takes highest priority
      const cachedAvatar = localStorage.getItem(`ceamis_avatar_${user.id}`);
      if (cachedAvatar) {
        mapped.avatarUrl = cachedAvatar;
      }

      // ── Restore AI-generated cluster label ────────────────────────────────
      const clusterLabel = localStorage.getItem("ceamis_cluster_label");
      if (clusterLabel) {
        mapped.label = clusterLabel;
      }

      setUserData(mapped);
      // Cache with merged data
      localStorage.setItem("ceamis_user", JSON.stringify(mapped));
    } catch {
      // Fallback: gunakan localStorage HANYA jika milik user yang sama
      if (savedData) {
        setUserData(savedData);
      } else {
        // Akun baru atau data tidak ada → mulai dari defaultUser dengan data auth
        setUserData({
          ...defaultUser,
          id: user.id,
          email: user.email || "",
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        });
      }
    } finally {
      setIsLoadingUser(false);
    }
  };

  useEffect(() => {
    refreshUser();
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        // Hapus semua data saat logout
        localStorage.removeItem("ceamis_user");
        localStorage.removeItem("ceamis_transactions");
        localStorage.removeItem("ceamis_cluster_label");
        setUserData(defaultUser);
      } else {
        refreshUser();
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => {
      const updated = { ...prev, ...data };
      localStorage.setItem("ceamis_user", JSON.stringify(updated));

      // Store avatar separately so it survives API refresh overwrites
      if (data.avatarUrl && updated.id) {
        localStorage.setItem(`ceamis_avatar_${updated.id}`, data.avatarUrl);
      }

      // Store cluster label separately whenever it's updated, so refreshUser can always restore it
      if (data.label && data.label !== "Pemula") {
        localStorage.setItem("ceamis_cluster_label", data.label);
      }
      
      // Sync to API in background (avatar_url may fail if base64 is large - that's ok, we use localStorage cache)
      if (updated.id) {
        usersApi.updateProfile(updated.id, {
          name: updated.name,
          phone: updated.phone,
        } as any).catch(err => console.warn("Failed to sync profile:", err));
      }
      
      return updated;
    });
  };

  const addXp = async (amount: number) => {
    if (!userData.id) return;
    try {
      const result = await usersApi.addXp(userData.id, amount);
      setUserData(prev => {
        const updated = { ...prev, xp: result.xp, level: result.level };
        // Preserve cluster label: also re-save it separately so refreshUser can restore it
        if (updated.label && updated.label !== "Pemula") {
          localStorage.setItem("ceamis_cluster_label", updated.label);
        }
        localStorage.setItem("ceamis_user", JSON.stringify(updated));
        return updated;
      });
    } catch {
      // Fallback local — optimistically update state AND persist to localStorage
      setUserData(prev => {
        const newXp = prev.xp + amount;
        const nextLevelXp = prev.level * 1000;
        const updated = newXp >= nextLevelXp
          ? { ...prev, xp: newXp - nextLevelXp, level: prev.level + 1 }
          : { ...prev, xp: newXp };
        // Preserve cluster label
        if (updated.label && updated.label !== "Pemula") {
          localStorage.setItem("ceamis_cluster_label", updated.label);
        }
        localStorage.setItem("ceamis_user", JSON.stringify(updated));
        return updated;
      });
    }
  };

  const unlockBadge = (badgeId: string) => {
    setUserData(prev => {
      if (prev.unlockedBadges.includes(badgeId)) return prev; // already unlocked
      const updated = { ...prev, unlockedBadges: [...prev.unlockedBadges, badgeId] };
      // Persist to localStorage immediately
      localStorage.setItem("ceamis_user", JSON.stringify(updated));
      // Sync to API in background (best-effort)
      if (prev.id) {
        usersApi.updateProfile(prev.id, {
          unlocked_badges: updated.unlockedBadges,
        } as any).catch(() => {/* silently ignore if API unavailable */});
      }
      return updated;
    });
  };

  const setHealthScore = (score: number, triggered: boolean) => {
    setUserData(prev => ({
      ...prev,
      healthScore: Math.round(score * 10) / 10,
      warningTriggered: triggered,
    }));
  };

  return (
    <UserContext.Provider
      value={{ userData, isLoadingUser, updateUserData, addXp, unlockBadge, setHealthScore, refreshUser }}
    >
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
