import { auth } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

window.register = function() {

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!nombre || !email || !password) {
    alert("Todos los campos son obligatorios");
    return;
  }

  if (password.length < 6) {
    alert("La contraseña debe tener mínimo 6 caracteres");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      alert("Cuenta creada correctamente");

      window.location.href = "formulario.html";
    })
    .catch((error) => {
    console.log("FULL ERROR:", error);
    console.log("CODE:", error.code);
    console.log("MESSAGE:", error.message);
    });
};