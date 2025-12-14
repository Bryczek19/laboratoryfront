"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // ESC zamyka drawer
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // klik "Menu": na desktop zwijaj sidebar, na mobile otwieraj drawer
  const handleMenuClick = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setCollapsed((v) => !v); // lg+
    } else {
      setMobileOpen(true); // <lg
    }
  };

  const sidebarWidth = useMemo(() => (collapsed ? "w-20" : "w-72"), [collapsed]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        {/* DESKTOP SIDEBAR */}
        <aside className={`hidden lg:block shrink-0 border-r border-slate-200 bg-white ${sidebarWidth}`}>
          <Sidebar collapsed={collapsed} />
        </aside>

        {/* MOBILE DRAWER */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              aria-label="Zamknij menu"
              className="absolute inset-0 bg-black/30"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-[18rem] bg-white shadow-xl">
              <Sidebar
                collapsed={false}
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
          </div>
        )}

        {/* CONTENT */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onMenuClick={handleMenuClick} />

          <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
            {children}
          </main>

          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-6xl px-6 py-4 text-xs text-slate-500">
              © 2025 LaboratoryFront
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
