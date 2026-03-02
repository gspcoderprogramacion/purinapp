import { auth } from "./firebaseConfig.js";
import { db } from "./firebaseConfig.js";
import { doc, setDoc, serverTimestamp } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("formDatos");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;

  const nombres = document.getElementById("nombres").value;
  const telefono = document.getElementById("telefono").value;
  const direccion = document.getElementById("direccion").value;

  await setDoc(doc(db, "usuarios", user.uid), {
    nombres: nombres,
    telefono: telefono,
    direccion: direccion,
    createdAt: serverTimestamp(),
    tipoUsuario: "usuario" // por defecto

  });

  alert("Registro completado");

  window.location.href = "./loader.js";
});