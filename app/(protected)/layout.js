"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!loading && !user) {
      const qs = searchParams?.toString();
      const returnUrl = qs ? `${pathname}?${qs}` : pathname;
      router.replace(`/user/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [loading, user, router, pathname, searchParams]);

  if (loading) return <div className="p-6">Ładowanie...</div>;
  if (!user) return null;

  return children;
}
