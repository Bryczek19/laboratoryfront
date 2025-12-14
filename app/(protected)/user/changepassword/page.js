"use client";

import { useState } from "react";
import Link from "next/link";
import { updatePassword } from "firebase/auth";
import { useAuth } from "@/app/context/AuthContext";

export default function ChangePasswordPage() {
  const { user, loading } = useAuth();

  const [newPass, setNewPass] = useState("");
  const [newPass2, setNewPass2] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (!user) {
      setErr("Brak zalogowanego użytkownika.");
      return;
    }

    if (newPass.length < 6) {
      setErr("Hasło musi mieć co najmniej 6 znaków.");
      return;
    }

    if (newPass !== newPass2) {
      setErr("Hasła nie są takie same.");
      return;
    }

    try {
      await updatePassword(user, newPass);
      setMsg("Hasło zostało zmienione ✅");
      setNewPass("");
      setNewPass2("");
    } catch (e) {
      const code = e?.code || "";
      if (code === "auth/requires-recent-login") {
        setErr("Musisz zalogować się ponownie, żeby zmienić hasło (wyloguj i zaloguj się jeszcze raz).");
      } else {
        setErr(`Błąd: ${code || "nieznany"}`);
      }
    }
  };

  if (loading) return <p>Ładowanie...</p>;

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-4">Zmień hasło</h1>

      <div className="mb-3">
        <Link className="underline" href="/user/profile">
          ← Profil
        </Link>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          type="password"
          placeholder="Nowe hasło"
          className="border p-2"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Powtórz nowe hasło"
          className="border p-2"
          value={newPass2}
          onChange={(e) => setNewPass2(e.target.value)}
          required
        />

        {err && <p className="text-red-500">{err}</p>}
        {msg && <p className="text-green-500">{msg}</p>}

        <button className="border p-2 bg-gray-900 text-white">
          Zmień hasło
        </button>
      </form>
    </div>
  );
}
