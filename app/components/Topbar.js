"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaThLarge, FaSignOutAlt } from "react-icons/fa";

const TITLES = {
  "/": "Strona główna",
  "/dashboard": "Dashboard",
  "/quiz": "Quizy",
  "/quiz/manage": "Panel tworzenia",
  "/user/signin": "Logowanie",
  "/user/register": "Rejestracja",
  "/user/profile": "Profil",
};

function getTitle(pathname) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname?.startsWith("/quiz/")) return "Quiz";
  return "Aplikacja";
}

export default function Topbar({ onMenuClick }) {
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
            aria-label="Menu"
          >
            <FaBars size={14} />
            Menu
          </button>

          <div className="hidden text-sm font-semibold text-slate-900 md:block">
            {title}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
          >
            <FaThLarge size={14} />
            Dashboard
          </Link>

          <Link
            href="/user/signout"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <FaSignOutAlt size={14} />
            <span className="text-white">Wyloguj</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
