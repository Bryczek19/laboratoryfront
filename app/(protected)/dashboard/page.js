import Link from "next/link";

function Card({ title, desc, href }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-base font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm text-slate-600">{desc}</div>
      <Link
        href={href}
        className="mt-4 inline-flex rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
      >
        Otwórz
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Tu masz szybki dostęp do quizów i panelu edycji.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Quizy" desc="Lista dostępnych quizów do rozwiązania." href="/quiz" />
        <Card title="Panel tworzenia" desc="Dodawaj / edytuj quizy i pytania." href="/quiz/manage" />
        <Card title="Profil" desc="Zobacz dane użytkownika." href="/user/profile" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold text-slate-900">Szybkie akcje</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50" href="/quiz/manage">
            + Nowy quiz
          </Link>
          <Link className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50" href="/quiz">
            Rozwiąż quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
