"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadQuizzes, saveQuizzes } from "../../_lib/store";
import { QuestionType, makeQuestion } from "../../_lib/model";

function renderHtml(html) {
  return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function QuizEditPage({ params }) {
  const router = useRouter();
  const [all, setAll] = useState([]);
  const quiz = useMemo(() => all.find((q) => q.id === params.id), [all, params.id]);

  useEffect(() => {
    setAll(loadQuizzes());
  }, []);

  const updateQuiz = (nextQuiz) => {
    const nextAll = all.map((q) => (q.id === nextQuiz.id ? nextQuiz : q));
    setAll(nextAll);
    saveQuizzes(nextAll);
  };

  if (!quiz) return <p>Ładowanie lub brak quizu…</p>;

  const setTitle = (v) => updateQuiz({ ...quiz, title: v });

  const addQuestion = (type) => {
    const nq = makeQuestion(type);
    const next = { ...quiz, questions: [...quiz.questions, nq] };
    updateQuiz(next);
  };

  const removeQuestion = (qid) => {
    const next = { ...quiz, questions: quiz.questions.filter((x) => x.id !== qid) };
    updateQuiz(next);
  };

  const updateQuestion = (qid, patch) => {
    const next = {
      ...quiz,
      questions: quiz.questions.map((q) => (q.id === qid ? { ...q, ...patch } : q)),
    };
    updateQuiz(next);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold">Edytor quizu (Temat 4)</h1>
        <button className="border px-3 py-2" onClick={() => router.push("/quiz/manage")}>
          Wróć
        </button>
      </div>

      <label className="block mb-4">
        <div className="font-semibold mb-1">Tytuł quizu</div>
        <input
          className="border p-2 w-full"
          value={quiz.title}
          onChange={(e) => setTitle(e.target.value)}
          data-testid="quiz-title"
        />
      </label>

      <div className="border rounded p-3 mb-6">
        <div className="font-semibold mb-2">Dodaj pytanie</div>
        <div className="flex flex-wrap gap-2">
          <button className="border px-3 py-2" onClick={() => addQuestion(QuestionType.SINGLE)}>
            + Single choice
          </button>
          <button className="border px-3 py-2" onClick={() => addQuestion(QuestionType.MULTI)}>
            + Multi choice
          </button>
          <button className="border px-3 py-2" onClick={() => addQuestion(QuestionType.FILL)}>
            + Fill fields
          </button>
          <button className="border px-3 py-2" onClick={() => addQuestion(QuestionType.MATCH)}>
            + Match pairs
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="border rounded p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="font-semibold">
                #{idx + 1} — Typ: <span className="underline">{q.type}</span>
              </div>
              <button className="underline" onClick={() => removeQuestion(q.id)}>
                Usuń pytanie
              </button>
            </div>

            <label className="block mb-3">
              <div className="font-semibold mb-1">Tytuł pytania</div>
              <input
                className="border p-2 w-full"
                value={q.title}
                onChange={(e) => updateQuestion(q.id, { title: e.target.value })}
              />
            </label>

            <label className="block mb-3">
              <div className="font-semibold mb-1">Treść (HTML)</div>
              <textarea
                className="border p-2 w-full min-h-[120px]"
                value={q.bodyHtml}
                onChange={(e) => updateQuestion(q.id, { bodyHtml: e.target.value })}
              />
              <div className="mt-2 text-sm opacity-80">Podgląd:</div>
              <div className="border rounded p-2 mt-1">{renderHtml(q.bodyHtml)}</div>
            </label>

            {q.type === QuestionType.SINGLE && (
              <SingleChoiceEditor question={q} onChange={(patch) => updateQuestion(q.id, patch)} />
            )}

            {q.type === QuestionType.MULTI && (
              <MultiChoiceEditor question={q} onChange={(patch) => updateQuestion(q.id, patch)} />
            )}

            {q.type === QuestionType.FILL && (
              <FillEditor question={q} onChange={(patch) => updateQuestion(q.id, patch)} />
            )}

            {q.type === QuestionType.MATCH && (
              <MatchEditor question={q} onChange={(patch) => updateQuestion(q.id, patch)} />
            )}
          </div>
        ))}

        {quiz.questions.length === 0 && <p>Dodaj pierwsze pytanie.</p>}
      </div>
    </div>
  );
}

/* ---------- EDYTORY TYPÓW PYTAŃ ---------- */

function OptionsEditor({ question, onChange, single }) {
  const options = question.options ?? [];
  const correct = new Set(question.correctOptionIds ?? []);

  const updateOption = (id, patch) => {
    onChange({
      options: options.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    });
  };

  const addOption = () => {
    const id = Math.random().toString(36).slice(2);
    onChange({
      options: [...options, { id, kind: "text", value: "" }],
    });
  };

  const removeOption = (id) => {
    const nextOptions = options.filter((o) => o.id !== id);
    const nextCorrect = (question.correctOptionIds ?? []).filter((x) => x !== id);
    onChange({ options: nextOptions, correctOptionIds: nextCorrect });
  };

  const toggleCorrect = (id) => {
    if (single) {
      onChange({ correctOptionIds: [id] });
      return;
    }
    const next = new Set(correct);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange({ correctOptionIds: Array.from(next) });
  };

  return (
    <div className="border rounded p-3">
      <div className="font-semibold mb-2">
        Opcje (rodzaj: tekst/obraz) + wskazanie poprawnych
      </div>

      <div className="flex flex-col gap-3">
        {options.map((o, i) => (
          <div key={o.id} className="border rounded p-2">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Opcja {i + 1}</div>
              <button className="underline" onClick={() => removeOption(o.id)}>
                Usuń
              </button>
            </div>

            <div className="flex gap-2 mb-2">
              <select
                className="border p-2"
                value={o.kind}
                onChange={(e) => updateOption(o.id, { kind: e.target.value })}
              >
                <option value="text">tekst</option>
                <option value="image">obraz</option>
              </select>

              <input
                className="border p-2 flex-1"
                placeholder={o.kind === "image" ? "URL obrazka" : "Tekst opcji"}
                value={o.value}
                onChange={(e) => updateOption(o.id, { value: e.target.value })}
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type={single ? "radio" : "checkbox"}
                checked={correct.has(o.id)}
                onChange={() => toggleCorrect(o.id)}
              />
              Poprawna
            </label>
          </div>
        ))}
      </div>

      <button className="border px-3 py-2 mt-3" onClick={addOption}>
        + Dodaj opcję
      </button>
    </div>
  );
}

function SingleChoiceEditor({ question, onChange }) {
  return <OptionsEditor question={question} onChange={onChange} single={true} />;
}

function MultiChoiceEditor({ question, onChange }) {
  return <OptionsEditor question={question} onChange={onChange} single={false} />;
}

function FillEditor({ question, onChange }) {
  const fill = question.fill;

  const setFill = (patch) => onChange({ fill: { ...fill, ...patch } });

  const addField = () => {
    const id = "f" + Math.random().toString(36).slice(2, 6);
    const nextFields = [...fill.fields, { id, label: `Pole ${fill.fields.length + 1}` }];
    const nextCorrect = { ...fill.correctByFieldId, [id]: fill.options[0] ?? "" };
    setFill({ fields: nextFields, correctByFieldId: nextCorrect });
  };

  const removeField = (id) => {
    const nextFields = fill.fields.filter((f) => f.id !== id);
    const nextCorrect = { ...fill.correctByFieldId };
    delete nextCorrect[id];
    setFill({ fields: nextFields, correctByFieldId: nextCorrect });
  };

  const addOption = () => {
    setFill({ options: [...fill.options, ""] });
  };

  const updateOption = (i, v) => {
    const next = [...fill.options];
    next[i] = v;
    setFill({ options: next });
  };

  return (
    <div className="border rounded p-3">
      <div className="font-semibold mb-2">
        Uzupełnianie pól na podstawie listy opcji (definiuj listę + pola)
      </div>

      <div className="mb-3">
        <div className="font-semibold mb-1">Lista opcji</div>
        <div className="flex flex-col gap-2">
          {fill.options.map((opt, i) => (
            <input
              key={i}
              className="border p-2"
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              placeholder={`Opcja ${i + 1}`}
            />
          ))}
        </div>
        <button className="border px-3 py-2 mt-2" onClick={addOption}>
          + Dodaj opcję do listy
        </button>
      </div>

      <div>
        <div className="font-semibold mb-1">Pola do uzupełnienia</div>
        <div className="flex flex-col gap-2">
          {fill.fields.map((f) => (
            <div key={f.id} className="border rounded p-2">
              <div className="flex items-center justify-between gap-2">
                <input
                  className="border p-2 flex-1"
                  value={f.label}
                  onChange={(e) => {
                    const nextFields = fill.fields.map((x) =>
                      x.id === f.id ? { ...x, label: e.target.value } : x
                    );
                    setFill({ fields: nextFields });
                  }}
                />
                <button className="underline" onClick={() => removeField(f.id)}>
                  Usuń pole
                </button>
              </div>

              <div className="mt-2">
                <div className="text-sm opacity-80">Poprawna wartość pola:</div>
                <select
                  className="border p-2 mt-1"
                  value={fill.correctByFieldId[f.id] ?? ""}
                  onChange={(e) =>
                    setFill({
                      correctByFieldId: { ...fill.correctByFieldId, [f.id]: e.target.value },
                    })
                  }
                >
                  {fill.options.map((o, i) => (
                    <option key={i} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        <button className="border px-3 py-2 mt-2" onClick={addField}>
          + Dodaj pole
        </button>
      </div>
    </div>
  );
}

function MatchEditor({ question, onChange }) {
  const match = question.match;

  const setMatch = (patch) => onChange({ match: { ...match, ...patch } });

  const addPair = () => {
    setMatch({ pairs: [...match.pairs, { left: "Lewo", right: "Prawo" }] });
  };

  const updatePair = (i, patch) => {
    const next = [...match.pairs];
    next[i] = { ...next[i], ...patch };
    setMatch({ pairs: next });
  };

  const removePair = (i) => {
    setMatch({ pairs: match.pairs.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="border rounded p-3">
      <div className="font-semibold mb-2">Dopasowanie par (definiowanie par)</div>

      <div className="flex flex-col gap-2">
        {match.pairs.map((p, i) => (
          <div key={i} className="border rounded p-2">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Para {i + 1}</div>
              <button className="underline" onClick={() => removePair(i)}>
                Usuń
              </button>
            </div>

            <div className="flex gap-2">
              <input
                className="border p-2 flex-1"
                value={p.left}
                onChange={(e) => updatePair(i, { left: e.target.value })}
                placeholder="Lewo"
              />
              <input
                className="border p-2 flex-1"
                value={p.right}
                onChange={(e) => updatePair(i, { right: e.target.value })}
                placeholder="Prawo"
              />
            </div>
          </div>
        ))}
      </div>

      <button className="border px-3 py-2 mt-3" onClick={addPair}>
        + Dodaj parę
      </button>
    </div>
  );
}
