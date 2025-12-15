"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const params = useSearchParams();
  const email = params.get("email") || "(brak email)";

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-3">Email not verified</h1>
      <p className="mb-4">
        Sprawdź skrzynkę pocztową i kliknij link weryfikacyjny wysłany na: <b>{email}</b>
      </p>

      <Link className="underline" href="/user/signin">
        Przejdź do logowania
      </Link>
    </div>
  );
}
