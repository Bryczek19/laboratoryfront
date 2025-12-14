"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadQuizzes } from "./_lib/store";

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    setQuizzes(loadQuizzes());
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quizy</h1>

      <Link className="underline" href="/quiz/manage">
        Panel tworzenia/edycji (Temat 4)
      </Link>

      <div className="mt-4 flex flex-col gap-3">
        {quizzes.map((q) => (
          <div key={q.id} className="border rounded p-3">
            <div className="font-semibold">{q.title}</div>
            <Link className="underline" href={`/quiz/${q.id}`} data-testid={`open-quiz-${q.id}`}>
              Start
            </Link>
          </div>
        ))}
        {quizzes.length === 0 && <p>Brak quizów. Wejdź w panel i utwórz pierwszy.</p>}
      </div>
    </div>
  );
}
