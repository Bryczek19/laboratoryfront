"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import VerifyContent from "./VerifyContent";

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Ładowanie...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
