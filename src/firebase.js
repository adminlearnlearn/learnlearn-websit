import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyATw8VsPXFRSzRQ44JVkF7MrD6t2bXRzPU",
  authDomain: "learnlearn-f3e11.firebaseapp.com",
  projectId: "learnlearn-f3e11",
  storageBucket: "learnlearn-f3e11.firebasestorage.app",
  messagingSenderId: "222538629706",
  appId: "1:222538629706:web:54bc35214df52406cbdcb3",
  measurementId: "G-9X32F14CF0"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);