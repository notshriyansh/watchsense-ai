import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDgFTTlbotUdi0ovV76MPBiChkVT_a50WI",
  authDomain: "netflix-gpt-e43ca.firebaseapp.com",
  projectId: "netflix-gpt-e43ca",
  storageBucket: "netflix-gpt-e43ca.firebasestorage.app",
  messagingSenderId: "60389820326",
  appId: "1:60389820326:web:9a2b9a7a4194a6ab27f167",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
