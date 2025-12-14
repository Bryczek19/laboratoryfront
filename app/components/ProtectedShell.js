"use client";

import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiHome, FiList, FiEdit3, FiUser, FiLogOut } from "react-icons/fi";
import NavItem from "./NavItem";
import { useAuth } from "@/app/context/AuthContext";

export default function ProtectedShell({ children }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-4">
        {/* TOPBAR */}
        <header className="mb-4 flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen((v) => !v)}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 hover:bg-zinc-800"
              aria-label="Toggle menu"
            >
              <RxHamburgerMenu />
            </button>

            <div className="leading-tight">
              <div className="text-sm font-semibold">LaboratoryFront</div>
              <div className="text-xs text-zinc-400">
                Zalogowany: {user?.email || "—"}
              </div>
            </div>
          </div>

          <div className="hidden sm:block text-xs text-zinc-400">
            Panel aplikacji / Quizy / Profil
          </div>
        </header>

        {/* LAYOUT */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[260px_1fr]">
          {/* SIDEBAR */}
          <aside
            className={[
              "rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3",
              open ? "block" : "hidden md:block",
            ].join(" ")}
          >
            <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Menu
            </div>

            <nav className="flex flex-col gap-1">
              <NavItem href="/dashboard" icon={FiHome}>Dashboard</NavItem>
              <NavItem href="/quiz" icon={FiList}>Quizy (lista)</NavItem>
              <NavItem href="/quiz/manage" icon={FiEdit3}>Panel tworzenia/edycji</NavItem>
              <NavItem href="/user/profile" icon={FiUser}>Profil</NavItem>
              <NavItem href="/user/signout" icon={FiLogOut}>Wyloguj</NavItem>
            </nav>

            <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 text-xs text-zinc-400">
              Tip: w quizach możesz dodać pytania typu <b>single</b>, <b>multi</b>, <b>fill</b>, <b>match</b>.
            </div>
          </aside>

          {/* CONTENT */}
          <main className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
