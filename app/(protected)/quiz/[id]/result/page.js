"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function QuizResultPage() {
  const params = useSearchParams();
  const score = params.get("score") ?? "0";
  const total = params.get("total") ?? "0";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Wynik</h1>
      <p className="mb-4">
        Twój wynik: <b>{score}</b> / <b>{total}</b>
      </p>

      <div className="flex gap-3">
        <Link className="underline" href="/quiz">Lista quizów</Link>
        <Link className="underline" href="/quiz/manage">Panel (edycja)</Link>
      </div>
    </div>
  );
}
