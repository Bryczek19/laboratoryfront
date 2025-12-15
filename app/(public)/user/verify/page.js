"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const params = useSearchParams();
  const email = params.get("email");

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-3">Email niezweryfikowany</h1>

      <p className="mb-4">
        Sprawdź skrzynkę i kliknij link weryfikacyjny wysłany na:
        <br />
        <b>{email}</b>
      </p>

      <Link className="underline" href="/user/signin">
        Przejdź do logowania
      </Link>
    </div>
  );
}
