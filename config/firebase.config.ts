import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAt90CQv3KE9LfXl8x4HvLfNagzRcVwPNo",
  authDomain: "auth3-c032a.firebaseapp.com",
  projectId: "auth3-c032a",
  storageBucket: "auth3-c032a.firebasestorage.app",
  messagingSenderId: "595237909819",
  appId: "1:595237909819:web:154f97358060e7c10ef31e",
  measurementId: "G-J0G5DP6K3Y"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
