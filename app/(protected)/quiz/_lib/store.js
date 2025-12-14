"use client";

const STORAGE_KEY = "laboratoryfront_quizzes_v1";

export function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export function loadQuizzes() {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  const data = raw ? safeParse(raw, []) : [];
  return Array.isArray(data) ? data : [];
}

export function saveQuizzes(quizzes) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes || []));
}

export function upsertQuiz(quiz) {
  const quizzes = loadQuizzes();
  const idx = quizzes.findIndex((q) => q.id === quiz.id);
  const next = [...quizzes];

  if (idx === -1) next.unshift(quiz);
  else next[idx] = quiz;

  saveQuizzes(next);
  return next;
}

export function removeQuiz(id) {
  const quizzes = loadQuizzes();
  const next = quizzes.filter((q) => q.id !== id);
  saveQuizzes(next);
  return next;
}
