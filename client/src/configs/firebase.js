import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCyWFqTBLaRWD3Z9Q3lnBKcOS5ZtHsrtLI",
  authDomain: "merrymatch-6ccbc.firebaseapp.com",
  projectId: "merrymatch-6ccbc",
  storageBucket: "merrymatch-6ccbc.appspot.com",
  messagingSenderId: "445038672557",
  appId: "1:445038672557:web:57c0258f65ef62d0216424",
  measurementId: "G-JRKRWGWRTY",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage();
const auth = getAuth(app);

export { db, storage, auth };
