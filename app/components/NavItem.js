"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavItem({ href, icon: Icon, children }) {
  const pathname = usePathname();
  const active = pathname === href || pathname?.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
        active
          ? "bg-zinc-800 text-white"
          : "text-zinc-300 hover:bg-zinc-900 hover:text-white",
      ].join(" ")}
    >
      {Icon ? <Icon className="text-lg" /> : null}
      <span>{children}</span>
    </Link>
  );
}