import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getAuth } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAuoosg73L7-4yP1HvyHnLH_RA9vGBNKlY",
  authDomain: "purinapp-a03df.firebaseapp.com",
  projectId: "purinapp-a03df",
  storageBucket: "purinapp-a03df.firebasestorage.app",
  messagingSenderId: "235970729496",
  appId: "1:235970729496:web:3761c953b4c5ae9f5dd56d",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);