"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

export const dynamic = "force-dynamic";

export default function ChangePasswordPage() {
  const { user, loading } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setInfo("");
    setError("");

    if (!user?.email) {
      setError("Brak użytkownika / email.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Nowe hasło musi mieć min. 6 znaków.");
      return;
    }
    if (newPassword !== newPassword2) {
      setError("Nowe hasła nie są takie same.");
      return;
    }

    try {
      setSaving(true);

      // reauth
      const cred = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, cred);

      // update
      await updatePassword(user, newPassword);

      setInfo("Hasło zmienione ✅");
      setCurrentPassword("");
      setNewPassword("");
      setNewPassword2("");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Błąd zmiany hasła.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Ładowanie...</p>;
  if (!user) return <p>Nie jesteś zalogowany.</p>;

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-4">Zmień hasło</h1>

      <p className="mb-3 text-sm text-gray-500">
        Email: <b>{user.email}</b>
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          className="border p-2"
          placeholder="Aktualne hasło"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
        />

        <input
          className="border p-2"
          placeholder="Nowe hasło"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
        />

        <input
          className="border p-2"
          placeholder="Powtórz nowe hasło"
          type="password"
          value={newPassword2}
          onChange={(e) => setNewPassword2(e.target.value)}
          autoComplete="new-password"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {info && <p className="text-green-600 text-sm">{info}</p>}

        <button className="border p-2 bg-gray-900 text-white disabled:opacity-60" disabled={saving} type="submit">
          {saving ? "Zmieniam..." : "Zmień hasło"}
        </button>
      </form>
    </div>
  );
}
