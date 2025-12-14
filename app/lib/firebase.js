import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAq6uVpLDKzYHmbnBujbdPTjQBvCN19kzc",
  authDomain: "laboratoryfront.firebaseapp.com",
  projectId: "laboratoryfront",
  storageBucket: "laboratoryfront.firebasestorage.app",
  messagingSenderId: "721271593414",
  appId: "1:721271593414:web:53314b862d1aad224f3ac7",
  measurementId: "G-QMCDBS8YW2",
};

// ważne: nie inicjalizuj 2 razy
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;
