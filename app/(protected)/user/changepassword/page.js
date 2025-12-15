"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { db } from "@/app/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [dataLoading, setDataLoading] = useState(true);

  // 🔹 ODCZYT danych z Firestore
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setStreet(data.address?.street || "");
          setCity(data.address?.city || "");
          setZipCode(data.address?.zipCode || "");
        }
      } catch (e) {
        setError("Błąd odczytu danych z Firestore");
      } finally {
        setDataLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // 🔹 ZAPIS danych do Firestore
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        address: {
          street,
          city,
          zipCode,
        },
      });

      setInfo("Dane zapisane poprawnie ✅");
    } catch (e) {
      setError("Błąd zapisu danych");
    }
  };

  if (loading || dataLoading) return <p>Ładowanie profilu...</p>;

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-4">Profil użytkownika</h1>

      <p className="mb-3 text-sm text-gray-400">
        Email: <b>{user.email}</b>
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          className="border p-2"
          placeholder="Ulica"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Miasto"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Kod pocztowy"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
        />

        {error && <p className="text-red-500">{error}</p>}
        {info && <p className="text-green-500">{info}</p>}

        <button className="border p-2 bg-gray-900 text-white">
          Zapisz dane
        </button>
      </form>
    </div>
  );
}
