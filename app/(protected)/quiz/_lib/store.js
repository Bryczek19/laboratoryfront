"use client";

const KEY = "lab_quizzes_v1";

export function loadQuizzes() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveQuizzes(quizzes) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(quizzes));
}

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
