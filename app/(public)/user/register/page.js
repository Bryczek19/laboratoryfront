"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

function friendlyFirebaseError(err) {
  const code = err?.code || "";

  if (code === "auth/email-already-in-use") return "Ten adres email jest już zajęty.";
  if (code === "auth/invalid-email") return "Nieprawidłowy adres email.";
  if (code === "auth/weak-password") return "Hasło jest zbyt słabe (min. 6 znaków).";
  if (code === "auth/operation-not-allowed") return "Rejestracja email/hasło nie jest włączona w Firebase.";
  if (code === "auth/network-request-failed") return "Błąd sieci. Sprawdź połączenie internetowe.";

  return err?.message || "Błąd rejestracji";
}

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const normalizedEmail = useMemo(() => email.trim(), [email]);

  // Jeśli user zalogowany — wg labów możesz ukryć rejestrację
  if (authLoading) return <div className="p-6">Ładowanie...</div>;
  if (user) {
    return (
      <div className="max-w-md">
        <h1 className="text-2xl font-bold mb-2">Rejestracja</h1>
        <p className="text-sm text-slate-600 mb-4">
          Jesteś już zalogowany jako <b>{user.email}</b>.
        </p>
        <Link className="underline" href="/dashboard">
          Przejdź do Dashboard
        </Link>
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (pass1 !== pass2) {
      setError("Hasła nie są takie same.");
      return;
    }
    if (pass1.length < 6) {
      setError("Hasło musi mieć min. 6 znaków.");
      return;
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, pass1);

      // wysyłka maila weryfikacyjnego
      await sendEmailVerification(cred.user);

      // Firebase domyślnie loguje po rejestracji – w labie ma być auto-wylogowanie
      await signOut(auth);

      const showEmail = cred.user.email || normalizedEmail;

      router.replace(`/user/verify?email=${encodeURIComponent(showEmail)}`);
    } catch (err) {
      setError(friendlyFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <label className="text-sm">Email</label>
        <input
          type="email"
          placeholder="Email"
          className="border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <label className="text-sm">Hasło</label>
        <input
          type="password"
          placeholder="Hasło"
          className="border p-2"
          value={pass1}
          onChange={(e) => setPass1(e.target.value)}
          required
          autoComplete="new-password"
        />

        <label className="text-sm">Powtórz hasło</label>
        <input
          type="password"
          placeholder="Powtórz hasło"
          className="border p-2"
          value={pass2}
          onChange={(e) => setPass2(e.target.value)}
          required
          autoComplete="new-password"
        />

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          className="border p-2 bg-gray-900 text-white disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? "Tworzenie konta..." : "Register"}
        </button>
      </form>

      <div className="mt-4 text-sm">
        Masz już konto?{" "}
        <Link className="underline" href="/user/signin">
          Zaloguj się
        </Link>
      </div>
    </div>
  );
}
