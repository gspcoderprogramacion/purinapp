import { auth } from "./firebaseConfig.js";
import { db } from "./firebaseConfig.js";

import { collection, addDoc, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("mascotaForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {

    const user = auth.currentUser;

    if (!user) {
      alert("Usuario no autenticado");
      return;
    }

    await addDoc(collection(db, "Mascotas"), {
      nombre: document.getElementById("nombre").value.trim(),
      especie: document.getElementById("especie").value,
      edad: Number(document.getElementById("edad").value),
      propietario_id: user.uid,
      raza: null,
      createdAt: serverTimestamp()
    });

    alert("Mascota registrada correctamente 🐾");
    form.reset();

  } catch (error) {
    console.error("Error al registrar mascota:", error);
    alert("Ocurrió un error al registrar");
  }
});