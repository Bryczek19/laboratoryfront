import { loadQuizzes } from "../_lib/store";
import QuizClient from "./QuizClient";

/* 🔥 WYMAGANE DLA output: export */
export async function generateStaticParams() {
  const quizzes = loadQuizzes();
  return quizzes.map((q) => ({
    id: q.id,
  }));
}

export default function QuizPage({ params }) {
  return <QuizClient quizId={params.id} />;
}
