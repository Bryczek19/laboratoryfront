import Link from "next/link";

function Card({ href, title, desc }) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="text-base font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm text-slate-600">{desc}</div>
      <div className="mt-4 text-sm font-medium text-slate-900">Otwórz →</div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Frontend Laboratory App</h1>
        <p className="mt-2 text-sm text-slate-600">
          Projekt zaliczeniowy — komponenty / quizy / część chroniona.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50" href="/user/signin">
            Logowanie
          </Link>
          <Link className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50" href="/user/register">
            Rejestracja
          </Link>
          <Link className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50" href="/dashboard">
            Dashboard
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card href="/user/signin" title="Zaloguj" desc="Przejdź do strony logowania." />
        <Card href="/user/register" title="Rejestracja" desc="Utwórz nowe konto użytkownika." />
        <Card href="/dashboard" title="Dashboard" desc="Szybki dostęp do quizów i panelu." />
        <Card href="/quiz" title="Quizy" desc="Lista quizów do rozwiązania." />
      </div>
    </div>
  );
}
