"use client";

import { useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminNavbar from "@/components/layout/AdminNavbar";
import "@/styles/dashboard.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth > 768) {
      setIsSidebarOpen(true);
    }
  }, []);

  return (
    <div className={`dashboard-layout ${isSidebarOpen ? "" : "dashboard-layout--collapsed"}`}>
      <AdminSidebar isOpen={isSidebarOpen} />
      <div className="dashboard-content">
        <AdminNavbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isOpen={isSidebarOpen} />
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}
