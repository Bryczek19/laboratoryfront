"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaSignInAlt,
  FaUserPlus,
  FaUser,
  FaSignOutAlt,
  FaThLarge,
  FaQuestionCircle,
  FaEdit,
  FaInfoCircle, // <-- DODANE
} from "react-icons/fa";

function SectionTitle({ children, collapsed }) {
  if (collapsed) return null;
  return (
    <div className="px-3 pt-4 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
      {children}
    </div>
  );
}

function NavItem({ href, icon: Icon, label, active, collapsed, onNavigate }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={[
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
        collapsed ? "justify-center" : "",
        active
          ? "bg-slate-100 text-slate-900 font-semibold"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
      ].join(" ")}
    >
      <Icon
        size={16}
        className={[
          "shrink-0 transition",
          active ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900",
        ].join(" ")}
      />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}

export default function Sidebar({ collapsed = false, onNavigate }) {
  const pathname = usePathname();
  const isActive = (href) => pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <div className="h-full">
      <div className="px-4 py-5">
        <div className="text-lg font-bold text-slate-900">
          {collapsed ? "LF" : "LaboratoryFront"}
        </div>
        {!collapsed && <div className="mt-1 text-xs text-slate-500">Menu nawigacji</div>}
      </div>

      <nav className="px-2 pb-6">
        <SectionTitle collapsed={collapsed}>Ogólne</SectionTitle>
        <NavItem
          href="/"
          icon={FaHome}
          label="Strona główna"
          active={isActive("/")}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />

        <SectionTitle collapsed={collapsed}>Konto</SectionTitle>
        <NavItem
          href="/user/signin"
          icon={FaSignInAlt}
          label="Zaloguj"
          active={isActive("/user/signin")}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
        <NavItem
          href="/user/register"
          icon={FaUserPlus}
          label="Rejestracja"
          active={isActive("/user/register")}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />

        {/* --- NOWA POZYCJA --- */}
        <NavItem
          href="/o-aplikacji"
          icon={FaInfoCircle}
          label="O aplikacji"
          active={isActive("/o-aplikacji")}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />

        <NavItem
          href="/user/profile"
          icon={FaUser}
          label="Profil"
          active={isActive("/user/profile")}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
        <NavItem
          href="/user/signout"
          icon={FaSignOutAlt}
          label="Wyloguj"
          active={isActive("/user/signout")}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />

        <SectionTitle collapsed={collapsed}>Aplikacja</SectionTitle>
        <NavItem
          href="/dashboard"
          icon={FaThLarge}
          label="Dashboard"
          active={isActive("/dashboard")}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
        <NavItem
          href="/quiz"
          icon={FaQuestionCircle}
          label="Quizy"
          active={isActive("/quiz")}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
        <NavItem
          href="/quiz/manage"
          icon={FaEdit}
          label="Panel tworzenia"
          active={isActive("/quiz/manage")}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
      </nav>
    </div>
  );
}
