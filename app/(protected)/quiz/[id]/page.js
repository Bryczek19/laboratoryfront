"use client";

export const dynamic = "force-dynamic";

import QuizClient from "./QuizClient";

export default function QuizPage({ params }) {
  return <QuizClient quizId={params.id} />;
}
