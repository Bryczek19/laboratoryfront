"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/lib/firebase";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // domyślnie po logowaniu lądujemy na /dashboard
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // ważne: router.replace, żeby user nie cofał do /signin po zalogowaniu
      router.replace(returnUrl);
    } catch (err) {
      // prosta, czytelna obsługa błędu
      setError(err?.message || "Błąd logowania");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Sign in</h1>

      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        <label className="text-sm">Email</label>
        <input
          className="border p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <label className="text-sm">Password</label>
        <input
          className="border p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        <button
          data-testid="signin-submit"
          className="border p-2 bg-gray-900 text-white disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? "Logowanie..." : "Sign in"}
        </button>
      </form>

      <div className="mt-4 text-sm">
        Nie masz konta?{" "}
        <Link className="underline" href="/user/register">
          Zarejestruj się
        </Link>
      </div>
    </div>
  );
}
