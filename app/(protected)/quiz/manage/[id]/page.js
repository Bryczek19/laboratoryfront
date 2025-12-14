"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { loadQuizzes, upsertQuiz, removeQuiz } from "../../_lib/store";
import { makeQuiz, makeQuestion, QuestionType } from "../../_lib/model";

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default function QuizManageByIdPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params?.id;

  const initialQuiz = useMemo(() => {
    const quizzes = loadQuizzes();
    const found = quizzes.find((q) => q.id === quizId);

    if (!found) {
      const q = makeQuiz("Nowy quiz");
      q.id = quizId;
      return q;
    }
    return found;
  }, [quizId]);

  const [quiz, setQuiz] = useState(() => clone(initialQuiz));
  const [info, setInfo] = useState("");

  const save = () => {
    const toSave = { ...quiz, updatedAt: Date.now() };
    upsertQuiz(toSave);
    setQuiz(clone(toSave));
    setInfo("Zapisano ✅");
    setTimeout(() => setInfo(""), 1200);
  };

  const del = () => {
    removeQuiz(quiz.id);
    router.push("/quiz/manage");
  };

  const addQuestion = (type) => {
    setQuiz((prev) => {
      const next = clone(prev);
      next.questions = next.questions || [];
      next.questions.push(makeQuestion(type));
      next.updatedAt = Date.now();
      return next;
    });
  };

  const removeQuestion = (qid) => {
    setQuiz((prev) => {
      const next = clone(prev);
      next.questions = (next.questions || []).filter((x) => x.id !== qid);
      next.updatedAt = Date.now();
      return next;
    });
  };

  const updateQuestion = (qid, patch) => {
    setQuiz((prev) => {
      const next = clone(prev);
      const idx = (next.questions || []).findIndex((x) => x.id === qid);
      if (idx === -1) return prev;
      next.questions[idx] = { ...next.questions[idx], ...patch };
      next.updatedAt = Date.now();
      return next;
    });
  };

  const updateOptionText = (qid, optId, value) => {
    setQuiz((prev) => {
      const next = clone(prev);
      const q = (next.questions || []).find((x) => x.id === qid);
      if (!q?.options) return prev;
      const o = q.options.find((x) => x.id === optId);
      if (!o) return prev;
      o.value = value;
      next.updatedAt = Date.now();
      return next;
    });
  };

  const addOption = (qid) => {
    setQuiz((prev) => {
      const next = clone(prev);
      const q = (next.questions || []).find((x) => x.id === qid);
      if (!q) return prev;
      q.options = q.options || [];

      const newOpt = { id: crypto.randomUUID(), kind: "text", value: "Nowa opcja" };
      q.options.push(newOpt);

      q.correctOptionIds = q.correctOptionIds || [];
      if (q.correctOptionIds.length === 0) q.correctOptionIds = [newOpt.id];

      next.updatedAt = Date.now();
      return next;
    });
  };

  const removeOption = (qid, optId) => {
    setQuiz((prev) => {
      const next = clone(prev);
      const q = (next.questions || []).find((x) => x.id === qid);
      if (!q?.options) return prev;

      q.options = q.options.filter((x) => x.id !== optId);
      q.correctOptionIds = (q.correctOptionIds || []).filter((x) => x !== optId);

      if ((q.correctOptionIds || []).length === 0 && q.options.length > 0) {
        q.correctOptionIds = [q.options[0].id];
      }

      next.updatedAt = Date.now();
      return next;
    });
  };

  const toggleCorrect = (qid, optId, isMulti) => {
    setQuiz((prev) => {
      const next = clone(prev);
      const q = (next.questions || []).find((x) => x.id === qid);
      if (!q) return prev;

      const cur = new Set(q.correctOptionIds || []);
      if (isMulti) {
        if (cur.has(optId)) cur.delete(optId);
        else cur.add(optId);
        q.correctOptionIds = Array.from(cur);
      } else {
        q.correctOptionIds = [optId];
      }

      next.updatedAt = Date.now();
      return next;
    });
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Edycja quizu</h1>
        <div className="flex gap-3">
          <Link className="underline" href="/quiz/manage">
            ← Wróć do panelu
          </Link>
          <Link className="underline" href="/quiz">
            Lista quizów
          </Link>
        </div>
      </div>

      <div className="mt-4 border rounded p-4 flex flex-col gap-3">
        <label className="font-semibold">Tytuł</label>
        <input
          className="border p-2"
          value={quiz.title || ""}
          onChange={(e) => setQuiz((p) => ({ ...p, title: e.target.value }))}
          placeholder="Np. Quiz z tematu 4"
        />

        <div className="flex gap-2">
          <button onClick={save} className="border px-3 py-2 bg-gray-900 text-white">
            Zapisz
          </button>
          <button onClick={del} className="border px-3 py-2">
            Usuń quiz
          </button>
          {info && <span className="text-green-500 self-center">{info}</span>}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Pytania</h2>

        <div className="flex flex-wrap gap-2">
          <button className="border px-3 py-2" onClick={() => addQuestion(QuestionType.SINGLE)}>
            + Single
          </button>
          <button className="border px-3 py-2" onClick={() => addQuestion(QuestionType.MULTI)}>
            + Multi
          </button>
          <button className="border px-3 py-2" onClick={() => addQuestion(QuestionType.FILL)}>
            + Fill
          </button>
          <button className="border px-3 py-2" onClick={() => addQuestion(QuestionType.MATCH)}>
            + Match
          </button>
        </div>

        {(quiz.questions || []).length === 0 && <p>Brak pytań. Dodaj pierwsze.</p>}

        {(quiz.questions || []).map((q, idx) => {
          const isMulti = q.type === QuestionType.MULTI;
          const isChoice = q.type === QuestionType.SINGLE || q.type === QuestionType.MULTI;

          return (
            <div key={q.id} className="border rounded p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold">
                  {idx + 1}. {q.type}
                </div>
                <button className="border px-3 py-1" onClick={() => removeQuestion(q.id)}>
                  Usuń pytanie
                </button>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <label className="text-sm">Tytuł pytania</label>
                <input className="border p-2" value={q.title || ""} onChange={(e) => updateQuestion(q.id, { title: e.target.value })} />

                <label className="text-sm">Treść (HTML)</label>
                <textarea className="border p-2 min-h-[90px]" value={q.bodyHtml || ""} onChange={(e) => updateQuestion(q.id, { bodyHtml: e.target.value })} />

                <label className="text-sm">Tekst przycisku</label>
                <input className="border p-2" value={q.submitLabel || ""} onChange={(e) => updateQuestion(q.id, { submitLabel: e.target.value })} />
              </div>

              {isChoice && (
                <div className="mt-4">
                  <div className="font-semibold mb-2">Opcje</div>

                  <div className="flex flex-col gap-2">
                    {(q.options || []).map((opt) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <input
                          type={isMulti ? "checkbox" : "radio"}
                          checked={(q.correctOptionIds || []).includes(opt.id)}
                          onChange={() => toggleCorrect(q.id, opt.id, isMulti)}
                        />
                        <input className="border p-2 flex-1" value={opt.value || ""} onChange={(e) => updateOptionText(q.id, opt.id, e.target.value)} />
                        <button className="border px-3 py-2" onClick={() => removeOption(q.id, opt.id)}>
                          Usuń
                        </button>
                      </div>
                    ))}

                    <button className="border px-3 py-2 w-fit" onClick={() => addOption(q.id)}>
                      + Dodaj opcję
                    </button>
                  </div>
                </div>
              )}

              {q.type === QuestionType.FILL && (
                <div className="mt-4">
                  <div className="text-sm text-gray-300">(FILL możesz rozbudować później — ważne, że struktura się zapisuje.)</div>
                </div>
              )}

              {q.type === QuestionType.MATCH && (
                <div className="mt-4">
                  <div className="text-sm text-gray-300">(MATCH możesz rozbudować później — ważne, że panel działa.)</div>
                </div>
              )}
            </div>
          );
        })}

        <div className="mt-4">
          <button onClick={save} className="border px-3 py-2 bg-gray-900 text-white">
            Zapisz wszystko
          </button>
        </div>
      </div>
    </div>
  );
}
