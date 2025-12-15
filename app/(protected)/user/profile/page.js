"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/app/context/AuthContext";
import { db } from "@/app/lib/firebase";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user?.uid) return;

    const loadProfile = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setStreet(data.street || "");
          setCity(data.city || "");
          setZip(data.zip || "");
        }
      } catch (err) {
        console.error(err);
        setError("Nie udało się pobrać danych z Firestore.");
      }
    };

    loadProfile();
  }, [loading, user?.uid]);

  const saveProfile = async () => {
    setError("");
    setInfo("");

    if (!/^\d{2}-\d{3}$/.test(zip)) {
      setError("Kod pocztowy musi mieć format 00-000");
      return;
    }

    try {
      const ref = doc(db, "users", user.uid);
      await setDoc(
        ref,
        {
          email: user.email,
          street,
          city,
          zip,
          updatedAt: Date.now(),
        },
        { merge: true }
      );

      setInfo("Zapisano dane ✔");
      setTimeout(() => setInfo(""), 2000);
    } catch (err) {
      console.error(err);
      setError("Błąd zapisu danych.");
    }
  };

  if (loading) return <p>Ładowanie profilu...</p>;
  if (!user) return <p>Nie jesteś zalogowany.</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <p className="mb-4">
        <strong>Email:</strong> {user.email}
      </p>

      <div className="flex flex-col gap-3">
        <input className="border p-2" placeholder="Ulica" value={street} onChange={(e) => setStreet(e.target.value)} />
        <input className="border p-2" placeholder="Miasto" value={city} onChange={(e) => setCity(e.target.value)} />
        <input className="border p-2" placeholder="Kod pocztowy (00-000)" value={zip} onChange={(e) => setZip(e.target.value)} />

        <button onClick={saveProfile} className="bg-gray-900 text-white px-4 py-2">
          Zapisz adres
        </button>

        {info && <p className="text-green-600">{info}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </div>
  );
}
