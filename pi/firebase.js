// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
