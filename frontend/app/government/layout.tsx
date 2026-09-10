"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

const SIDEBAR_STORAGE_KEY = "government-sidebar-collapsed";
const SIDEBAR_EVENT = "government-sidebar-toggle";

export default function GovernmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isDashboard = pathname === "/government/dashboard";

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem(SIDEBAR_STORAGE_KEY);

    if (savedState === "true") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSidebarCollapsed(true);
    }

    const handleSidebarToggle = (event: Event) => {
      const customEvent = event as CustomEvent<boolean>;
      setSidebarCollapsed(customEvent.detail);
    };

    window.addEventListener(SIDEBAR_EVENT, handleSidebarToggle);

    return () => {
      window.removeEventListener(
        SIDEBAR_EVENT,
        handleSidebarToggle
      );
    };
  }, []);

  // Dashboard ko GovernmentLayout se completely independent rakho
  if (isDashboard) {
    return children;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div
        className={
          sidebarCollapsed
            ? "min-h-screen transition-all duration-300 lg:ml-[78px]"
            : "min-h-screen transition-all duration-300 lg:ml-[260px]"
        }
      >
        {children}
      </div>
    </div>
  );
}