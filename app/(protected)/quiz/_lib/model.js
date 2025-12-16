export const QuestionType = {
  SINGLE: "single",
  MULTI: "multi",
  FILL: "fill",
  MATCH: "match",
};

// opcja (tekst/obraz)
export function makeOption() {
  return {
    id: crypto?.randomUUID?.() ?? String(Math.random()),
    kind: "text", // "text" | "image"
    value: "",
  };
}

export function makeQuestion(type) {
  return {
    id: crypto?.randomUUID?.() ?? String(Math.random()),
    type,
    title: "Nowe pytanie",
    bodyHtml: "<p>Treść pytania (HTML)</p>",

    // single/multi
    options: [makeOption(), makeOption()],
    correctOptionIds: [], // multi: wiele, single: 1 element

    // fill
    fill: {
      fields: [{ id: "f1", label: "Pole 1" }],
      options: ["A", "B", "C"],
      correctByFieldId: { f1: "A" },
    },

    // match
    match: {
      pairs: [{ left: "Lewo 1", right: "Prawo 1" }],
    },
  };
}

export function makeQuiz() {
  return {
    id: crypto?.randomUUID?.() ?? String(Math.random()),
    title: "Nowy quiz",
    questions: [],
  };
}
