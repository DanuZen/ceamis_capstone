"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
          console.error("Failed to check onboarding date:", e);
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
            <div className={`dashboard-layout ${isSidebarOpen ? "" : "dashboard-layout--collapsed"}`}>
              <Sidebar isOpen={isSidebarOpen} />
              <div className="dashboard-content">
                <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isOpen={isSidebarOpen} />
                <main className="dashboard-main">{children}</main>
              </div>
            </div>
          </OnboardingGuard>
        </TransactionProvider>
      </UserProvider>
    </GuestProvider>
  );
}
