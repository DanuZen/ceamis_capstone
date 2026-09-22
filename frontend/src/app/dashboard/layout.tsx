"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { TransactionProvider } from "@/context/TransactionContext";
import { UserProvider, useUser } from "@/context/UserContext";
import { GuestProvider, useGuest } from "@/context/GuestContext";
import { onboardingApi } from "@/lib/api";

function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { userData, isLoadingUser } = useUser();
  const { isGuest } = useGuest();
  const router = useRouter();

  useEffect(() => {
    if (isLoadingUser || isGuest) return;
    
    if (userData.id) {
      const checkOnboardingDate = async () => {
        try {
          const data = await onboardingApi.get(userData.id);
          if (data && data.completed_at) {
            const completedDate = new Date(data.completed_at);
            const now = new Date();
            
            // Paksa pembaruan jika bulan atau tahun berbeda (per 1 bulan)
            if (completedDate.getMonth() !== now.getMonth() || completedDate.getFullYear() !== now.getFullYear()) {
              router.push("/onboarding");
            }
          } else {
            if (!userData.onboardingCompleted) {
              router.push("/onboarding");
            }
          }
        } catch (e) {
          console.warn("Could not check onboarding date (backend may be unreachable):", e);
        }
      };
      
      checkOnboardingDate();
    }
  }, [userData.id, isLoadingUser, isGuest, router, userData.onboardingCompleted]);

  return <>{children}</>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth > 768) {
      setIsSidebarOpen(true);
    }
  }, []);

  return (
    <GuestProvider>
      <UserProvider>
        <TransactionProvider>
          <OnboardingGuard>
            <DashboardShell isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}>
              {children}
            </DashboardShell>
          </OnboardingGuard>
        </TransactionProvider>
      </UserProvider>
    </GuestProvider>
  );
}

function DashboardShell({
  isSidebarOpen,
  setIsSidebarOpen,
  children,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className={`dashboard-layout ${isSidebarOpen ? "" : "dashboard-layout--collapsed"}`}>
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="dashboard-content">
        <Navbar isOpen={isSidebarOpen} />
        <main className="dashboard-main" style={{ padding: "0.75rem 2rem 2rem 2rem" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
