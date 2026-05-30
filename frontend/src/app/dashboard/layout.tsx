"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { TransactionProvider } from "@/context/TransactionContext";
import { UserProvider } from "@/context/UserContext";
import { GuestProvider } from "@/context/GuestContext";
import { ToastProvider } from "@/components/ui/Toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <GuestProvider>
      <UserProvider>
        <TransactionProvider>
          <ToastProvider>
            <div className={`dashboard-layout ${isSidebarOpen ? "" : "dashboard-layout--collapsed"}`}>
              <Sidebar isOpen={isSidebarOpen} />
              <div className="dashboard-content">
                <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isOpen={isSidebarOpen} />
                <main className="dashboard-main">{children}</main>
              </div>
            </div>
          </ToastProvider>
        </TransactionProvider>
      </UserProvider>
    </GuestProvider>
  );
}
