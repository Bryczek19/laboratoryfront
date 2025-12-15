export default function AboutPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">O aplikacji</h1>

      <div className="rounded-xl border border-slate-200 bg-white p-4 mb-6">
        <p className="mb-1">
          <b>Wykonał:</b> Konrad Bryk
        </p>
        <p>
          <b>Nr indeksu:</b> 15234
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Co to za aplikacja?</h2>
      <p className="mb-4 text-slate-700">
        LaboratoryFront to aplikacja do tworzenia i rozwiązywania quizów.
        Użytkownik może przeglądać listę quizów, uruchamiać wybrany quiz i
        odpowiadać na pytania. Po zatwierdzeniu odpowiedzi aplikacja pokazuje,
        czy była poprawna, a na końcu wyświetla wynik.
      </p>

      <h2 className="text-xl font-semibold mb-2">Jak działa quiz?</h2>
      <ul className="list-disc pl-6 text-slate-700 space-y-1">
        <li>Wybierasz quiz z listy.</li>
        <li>Odpowiadasz na pytania po kolei.</li>
        <li>Najpierw klikasz <b>Zatwierdź</b>, potem <b>Następne</b>.</li>
        <li>Na końcu dostajesz wynik: liczba poprawnych / liczba wszystkich.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-5 mb-2">Typy pytań</h2>
      <ul className="list-disc pl-6 text-slate-700 space-y-1">
        <li><b>single</b> – jedna poprawna odpowiedź (radio)</li>
        <li><b>multi</b> – wiele poprawnych odpowiedzi (checkbox)</li>
        <li><b>fill</b> – uzupełnianie pól (select)</li>
        <li><b>match</b> – dopasowywanie par (select)</li>
      </ul>
    </div>
  );
}
