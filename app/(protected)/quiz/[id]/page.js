"use client";

import { useEffect, useMemo, useState } from "react";
import { loadQuizzes } from "../_lib/store";
import { QuestionType } from "../_lib/model";
import { useRouter } from "next/navigation";

function QuestionHtml({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function QuizRunPage({ params }) {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);
  const [index, setIndex] = useState(0);

  const [answers, setAnswers] = useState({});     // odpowiedzi użytkownika
  const [submitted, setSubmitted] = useState({}); // czy pytanie zatwierdzone
  const [correct, setCorrect] = useState({});     // wynik per pytanie true/false

  useEffect(() => setQuizzes(loadQuizzes()), []);

  const quiz = useMemo(() => quizzes.find((q) => q.id === params.id), [quizzes, params.id]);
  const q = quiz?.questions?.[index];

  if (!quiz) return <p>Nie znaleziono quizu.</p>;
  if (!q) return <p>Quiz nie ma pytań. Dodaj je w panelu.</p>;

  const submit = () => {
    const isOk = checkAnswer(q, answers[q.id]);
    setSubmitted((p) => ({ ...p, [q.id]: true }));
    setCorrect((p) => ({ ...p, [q.id]: isOk }));
  };

  const next = () => {
    if (index < quiz.questions.length - 1) setIndex((x) => x + 1);
    else {
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
        <h2 data-testid="q-title" className="text-xl font-semibold mb-2">{q.title}</h2>

        <div data-testid="q-body" className="mb-4">
          <QuestionHtml html={q.bodyHtml} />
        </div>

        {/* część wypełniana przez użytkownika (zależna od typu) */}
        <AnswerArea
          question={q}
          value={answers[q.id]}
          onChange={(v) => setAnswers((p) => ({ ...p, [q.id]: v }))}
          disabled={!!submitted[q.id]}
        />

        <div className="mt-4 flex gap-2">
          <button
            data-testid="submit"
            className="border px-3 py-2"
            onClick={submit}
            disabled={!!submitted[q.id]}
          >
            Zatwierdź
          </button>

          <button
            data-testid="next"
            className="border px-3 py-2"
            onClick={next}
            disabled={!submitted[q.id]}
          >
            {index < quiz.questions.length - 1 ? "Następne" : "Zakończ"}
          </button>
        </div>

        {submitted[q.id] && (
          <p data-testid="feedback" className="mt-3 font-semibold">
            {correct[q.id] ? "✅ Poprawnie" : "❌ Błędnie"}
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------- Answer Areas ---------- */

function AnswerArea({ question, value, onChange, disabled }) {
  switch (question.type) {
    case QuestionType.SINGLE:
      return (
        <SingleChoice question={question} value={value} onChange={onChange} disabled={disabled} />
      );
    case QuestionType.MULTI:
      return (
        <MultiChoice question={question} value={value} onChange={onChange} disabled={disabled} />
      );
    case QuestionType.FILL:
      return <FillFields question={question} value={value} onChange={onChange} disabled={disabled} />;
    case QuestionType.MATCH:
      return <MatchPairs question={question} value={value} onChange={onChange} disabled={disabled} />;
    default:
      return <p>Nieznany typ pytania.</p>;
  }
}

function renderOption(opt) {
  if (opt.kind === "image") {
    return <img src={opt.value} alt="option" className="max-h-24 border" />;
  }
  return <span>{opt.value}</span>;
}

function SingleChoice({ question, value, onChange, disabled }) {
  const selectedId = value ?? "";
  return (
    <div className="flex flex-col gap-2" data-testid="single-area">
      {question.options.map((o, i) => (
        <label key={o.id} className="flex items-center gap-2">
          <input
            data-testid={`single-${i}`}
            type="radio"
            name={question.id}
            checked={selectedId === o.id}
            disabled={disabled}
            onChange={() => onChange(o.id)}
          />
          {renderOption(o)}
        </label>
      ))}
    </div>
  );
}

function MultiChoice({ question, value, onChange, disabled }) {
  const set = new Set(value ?? []);
  const toggle = (id) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(Array.from(next));
  };

  return (
    <div className="flex flex-col gap-2" data-testid="multi-area">
      {question.options.map((o, i) => (
        <label key={o.id} className="flex items-center gap-2">
          <input
            data-testid={`multi-${i}`}
            type="checkbox"
            checked={set.has(o.id)}
            disabled={disabled}
            onChange={() => toggle(o.id)}
          />
          {renderOption(o)}
        </label>
      ))}
    </div>
  );
}

function FillFields({ question, value, onChange, disabled }) {
  const fill = question.fill;
  const current = value ?? {}; // { fieldId: chosenOption }

  const setField = (fieldId, v) => {
    onChange({ ...current, [fieldId]: v });
  };

  return (
    <div data-testid="fill-area" className="flex flex-col gap-3">
      {fill.fields.map((f, i) => (
        <div key={f.id} className="border rounded p-2">
          <div className="font-semibold mb-1">{f.label}</div>
          <select
            data-testid={`fill-${i}`}
            className="border p-2"
            value={current[f.id] ?? ""}
            disabled={disabled}
            onChange={(e) => setField(f.id, e.target.value)}
          >
            <option value="">-- wybierz --</option>
            {fill.options.map((o, idx) => (
              <option key={idx} value={o}>{o}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

function MatchPairs({ question, value, onChange, disabled }) {
  const pairs = question.match.pairs;
  const rightList = pairs.map((p) => p.right);
  const current = value ?? {}; // { leftIndex: chosenRight }

  const setMatch = (leftIndex, v) => {
    onChange({ ...current, [leftIndex]: v });
  };

  return (
    <div data-testid="match-area" className="flex flex-col gap-3">
      {pairs.map((p, i) => (
        <div key={i} className="border rounded p-2">
          <div className="font-semibold mb-1">Dopasuj: {p.left}</div>
          <select
            data-testid={`match-${i}`}
            className="border p-2"
            value={current[i] ?? ""}
            disabled={disabled}
            onChange={(e) => setMatch(i, e.target.value)}
          >
            <option value="">-- wybierz --</option>
            {rightList.map((r, idx) => (
              <option key={idx} value={r}>{r}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

/* ---------- Sprawdzenie odpowiedzi ---------- */

function checkAnswer(question, userValue) {
  if (question.type === QuestionType.SINGLE) {
    const correctId = question.correctOptionIds?.[0];
    return userValue && correctId && userValue === correctId;
  }

  if (question.type === QuestionType.MULTI) {
    const correct = new Set(question.correctOptionIds ?? []);
    const user = new Set(userValue ?? []);
    if (correct.size !== user.size) return false;
    for (const id of correct) if (!user.has(id)) return false;
    return true;
  }

  if (question.type === QuestionType.FILL) {
    const fill = question.fill;
    const ans = userValue ?? {};
    return fill.fields.every((f) => ans[f.id] === fill.correctByFieldId[f.id]);
  }

  if (question.type === QuestionType.MATCH) {
    const pairs = question.match.pairs;
    const ans = userValue ?? {};
    return pairs.every((p, i) => ans[i] === p.right);
  }

  return false;
}
