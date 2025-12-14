"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <p><b>Email:</b> {user?.email}</p>
      <p><b>UID:</b> {user?.uid}</p>

      <div className="mt-4 flex gap-3">
        <Link className="underline" href="/dashboard">Dashboard</Link>
        <Link className="underline" href="/quiz">Quizy</Link>
      </div>
    </div>
  );
}
