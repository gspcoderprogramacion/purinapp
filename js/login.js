import { auth } from "./firebaseConfig.js";
import { signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

window.login = function() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      // 🔥 No mostramos lógica aquí
      // Solo redirigimos al dashboard

      window.location.href = "loader.html";

    })
    .catch((error) => {
      alert("Error: " + error.message);
    });

};