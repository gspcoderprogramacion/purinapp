//importaciones
import { auth } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

window.register = function() {

  //guarda los datos del formulario
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordConfirmado = document.getElementById("passwordConfirmado").value;

  //valida que no sea null ningun dato del formulario
  if (!email || !password || !passwordConfirmado) {
    alert("Todos los campos son obligatorios");
    return;
  }

  //valida que sean iguales la contraseña y la confirmación, sino es así limpia los dos campos
  if (passwordConfirmado !== password) {
    alert("los campos contraseña y confirmacion contraseña no coinciden");
    document.getElementById("password").value = "";
    document.getElementById("passwordConfirmado").value = "";

    return;
  }

  //valida que almenos que tenga 6 caracteres la contraseña
  if (password.length < 6) {
    alert("La contraseña debe tener mínimo 6 caracteres");
    return;
  }

  //Crea el usuario en firebase autenticator
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      alert("Cuenta creada correctamente");

      window.location.href = "index.html";
    })
    .catch((error) => {
    console.log("FULL ERROR:", error);
    console.log("CODE:", error.code);
    console.log("MESSAGE:", error.message);
    alert("MESSAGE:" + error.message);
    });
};