import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export function requireAuth(callback) {

  onAuthStateChanged(auth, (user) => {

    if (!user) {
      window.location.href = "index.html";
      return;
    }

    callback(user); // continúa la ejecución

  });

}