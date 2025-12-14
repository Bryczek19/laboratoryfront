"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    signOut(auth).finally(() => {
      router.replace("/user/signin");
    });
  }, [router]);

  return <p>Wylogowywanie...</p>;
}
