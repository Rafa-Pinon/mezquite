import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBiCah7qIjQOWXnkXjzGAltIa-nak3MVlw",
  authDomain: "mezquite-a7054.firebaseapp.com",
  projectId: "mezquite-a7054",
  storageBucket: "mezquite-a7054.firebasestorage.app",
  messagingSenderId: "262036813702",
  appId: "1:262036813702:web:dcd1005e4da6b8c7c45e07",
  measurementId: "G-8CLHDX5JHW",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
