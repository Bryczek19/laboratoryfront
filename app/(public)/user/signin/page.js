"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";

export const dynamic = "force-dynamic";

function SignInInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const returnUrl = useMemo(() => {
    return searchParams.get("returnUrl") || "/dashboard";
  }, [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      if (!cred.user.emailVerified) {
        const showEmail = cred.user.email || email;
        await signOut(auth);
        router.replace(`/user/verify?email=${encodeURIComponent(showEmail)}`);
        return;
      }

      router.replace(returnUrl);
    } catch (err) {
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

        {error && <p className="text-red-500 text-sm">{error}</p>}

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

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="p-6">Ładowanie...</div>}>
      <SignInInner />
    </Suspense>
  );
}
