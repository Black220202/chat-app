import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBA08aaHB2JeoF2QEzUYaSidA6q_XJCZf4",
  authDomain: "chatapp-eae8e.firebaseapp.com",
  projectId: "chatapp-eae8e",
  storageBucket: "chatapp-eae8e.firebasestorage.app",
  messagingSenderId: "809463951957",
  appId: "1:809463951957:web:4aa889081c33756aec9adc",
  measurementId: "G-7TMXW63WTH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider };
