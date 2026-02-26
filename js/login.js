import { auth } from "./firebaseConfig.js";
import { signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

window.login = function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Bienvenido " + userCredential.user.email);
      window.location.href = "formulario.html";
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
};