import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2R8YA0wTNnnbkZMykPsjl2k5V_ilrL_g",
  authDomain: "bola-68f40.firebaseapp.com",
  projectId: "bola-68f40",
  storageBucket: "bola-68f40.appspot.com",
  messagingSenderId: "256581517033",
  appId: "1:256581517033:web:45e4208aa739e13d90fa78"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);