import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCjcDfBOyZdcymDiCDfYHueoXMsuhR45RE",
  authDomain: "aevm-889c7.firebaseapp.com",
  projectId: "aevm-889c7",
  storageBucket: "aevm-889c7.firebasestorage.app",
  messagingSenderId: "395236309261",
  appId: "1:395236309261:web:8b0f53a60cd2c0339c9844",
  measurementId: "G-16SKKM2CRR",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
