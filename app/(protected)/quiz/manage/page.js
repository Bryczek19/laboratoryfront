"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadQuizzes, saveQuizzes } from "../_lib/store";
import { makeQuiz } from "../_lib/model";

export default function QuizManagePage() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    setQuizzes(loadQuizzes());
  }, []);

  const createQuiz = () => {
    const q = makeQuiz(`Quiz ${quizzes.length + 1}`);
    const next = [q, ...quizzes];
    setQuizzes(next);
    saveQuizzes(next);
  };

  const removeQuiz = (id) => {
    const next = quizzes.filter((q) => q.id !== id);
    setQuizzes(next);
    saveQuizzes(next);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Zarządzanie quizami
      </h1>

      <div className="flex gap-2 mb-4">
        <button className="border px-3 py-2" onClick={createQuiz}>
          + Nowy quiz
        </button>

        <Link className="underline px-3 py-2" href="/quiz">
          Powrót do quizów
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {quizzes.map((q) => (
          <div key={q.id} className="border rounded p-3">
            <div className="font-semibold">{q.title}</div>

            <div className="flex gap-3 mt-2">
              <Link className="underline" href={`/quiz/manage/${q.id}`}>
                Edytuj
              </Link>

              <button
                className="underline"
                onClick={() => removeQuiz(q.id)}
              >
                Usuń
              </button>

              <Link className="underline" href={`/quiz/${q.id}`}>
                Rozwiąż
              </Link>
            </div>
          </div>
        ))}

        {quizzes.length === 0 && (
          <p>Brak quizów.</p>
        )}
      </div>
    </div>
  );
}
