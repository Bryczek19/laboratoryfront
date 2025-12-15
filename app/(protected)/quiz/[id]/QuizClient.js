"use client";

import { useEffect, useMemo, useState } from "react";
import { loadQuizzes } from "../_lib/store";
import { QuestionType } from "../_lib/model";
import { useRouter } from "next/navigation";

function QuestionHtml({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function QuizClient({ quizId }) {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);
  const [index, setIndex] = useState(0);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [correct, setCorrect] = useState({});

  useEffect(() => {
    setQuizzes(loadQuizzes());
  }, []);

  const quiz = useMemo(
    () => quizzes.find((q) => q.id === quizId),
    [quizzes, quizId]
  );

  const q = quiz?.questions?.[index];

  if (!quiz) return <p>Nie znaleziono quizu.</p>;
  if (!q) return <p>Quiz nie ma pytań.</p>;

  const submit = () => {
    const isOk = checkAnswer(q, answers[q.id]);
    setSubmitted((p) => ({ ...p, [q.id]: true }));
    setCorrect((p) => ({ ...p, [q.id]: isOk }));
  };

  const next = () => {
    if (index < quiz.questions.length - 1) {
      setIndex((x) => x + 1);
    } else {
      const total = quiz.questions.length;
      const score = Object.values(correct).filter(Boolean).length;
      router.push(`/quiz/${quiz.id}/result?score=${score}&total=${total}`);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
      <p className="mb-4">
        Pytanie {index + 1} / {quiz.questions.length}
      </p>

      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold mb-2">{q.title}</h2>

        <div className="mb-4">
          <QuestionHtml html={q.bodyHtml} />
        </div>

        <AnswerArea
          question={q}
          value={answers[q.id]}
          onChange={(v) =>
            setAnswers((p) => ({ ...p, [q.id]: v }))
          }
          disabled={!!submitted[q.id]}
        />

        <div className="mt-4 flex gap-2">
          <button
            className="border px-3 py-2"
            onClick={submit}
            disabled={!!submitted[q.id]}
          >
            Zatwierdź
          </button>

          <button
            className="border px-3 py-2"
            onClick={next}
            disabled={!submitted[q.id]}
          >
            {index < quiz.questions.length - 1
              ? "Następne"
              : "Zakończ"}
          </button>
        </div>

        {submitted[q.id] && (
          <p className="mt-3 font-semibold">
            {correct[q.id] ? "✅ Poprawnie" : "❌ Błędnie"}
          </p>
        )}
      </div>
    </div>
  );
}

function AnswerArea({ question, value, onChange, disabled }) {
  if (question.type === QuestionType.SINGLE) {
    return (
      <div className="flex flex-col gap-2">
        {question.options.map((o) => (
          <label key={o.id} className="flex gap-2">
            <input
              type="radio"
              checked={value === o.id}
              disabled={disabled}
              onChange={() => onChange(o.id)}
            />
            <span>{o.value}</span>
          </label>
        ))}
      </div>
    );
  }

  return <p>Typ pytania nieobsługiwany.</p>;
}

function checkAnswer(question, userValue) {
  const correctId = question.correctOptionIds?.[0];
  return userValue === correctId;
}
