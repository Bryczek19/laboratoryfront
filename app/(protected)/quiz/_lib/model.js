"use client";

import { uid } from "./store";

export const QuestionType = {
  SINGLE: "single",
  MULTI: "multi",
  FILL: "fill",
  MATCH: "match",
};

export function makeQuiz(title = "Nowy quiz") {
  return {
    id: uid(),
    title,
    questions: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function makeQuestion(type) {
  const base = {
    id: uid(),
    type,
    title: "Nowe pytanie",
    bodyHtml: "<p>Treść pytania (HTML)</p>",
    submitLabel: "Zatwierdź",
  };

  if (type === QuestionType.SINGLE || type === QuestionType.MULTI) {
    const o1 = { id: uid(), kind: "text", value: "Opcja A" };
    const o2 = { id: uid(), kind: "text", value: "Opcja B" };
    return {
      ...base,
      options: [o1, o2],
      correctOptionIds: [o1.id],
    };
  }

  if (type === QuestionType.FILL) {
    const f1 = { id: uid(), label: "Pole 1" };
    return {
      ...base,
      fill: {
        options: ["A", "B", "C"],
        fields: [f1],
        correctByFieldId: { [f1.id]: "A" },
      },
    };
  }

  if (type === QuestionType.MATCH) {
    return {
      ...base,
      match: {
        pairs: [
          { left: "1", right: "jeden" },
          { left: "2", right: "dwa" },
        ],
      },
    };
  }

  return base;
}
