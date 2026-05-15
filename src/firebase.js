import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC9Z_kX_mBZeUbY70dveQ2yLrimxFwUclo",
  authDomain: "learnlearn-ef8b0.firebaseapp.com",
  projectId: "learnlearn-ef8b0",
  storageBucket: "learnlearn-ef8b0.firebasestorage.app",
  messagingSenderId: "72541568730",
  appId: "1:72541568730:web:88ab347c3b8cea3738efe3",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);