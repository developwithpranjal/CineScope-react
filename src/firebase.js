import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChdrSdskMx_QhlQvEtB2j9RYCRVR0p4LQ",
  authDomain: "cinescope-73fac.firebaseapp.com",
  projectId: "cinescope-73fac",
  appId: "1:86179158240:web:0abff22936452ab2ac9885",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);