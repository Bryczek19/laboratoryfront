"use client";

export const dynamic = "force-dynamic";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { loadQuizzes } from "@/app/(protected)/quiz/_lib/store";

export default function QuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const quizzes = loadQuizzes();
    const found = quizzes.find((q) => q.id === id);
    setQuiz(found || null);
  }, [id]);

  if (!quiz) {
    return <p>Quiz nie istnieje lub został usunięty.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
      <p>Liczba pytań: {quiz.questions?.length ?? 0}</p>
    </div>
  );
}
