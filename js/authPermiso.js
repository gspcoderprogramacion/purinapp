import { db } from "./firebaseConfig.js";
import { doc, getDoc } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function validateRole(user) {

  const docRef = doc(db, "usuarios", user.uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    window.location.href = "formUsuario.html";
    return;
  }

  const datos = docSnap.data();

  if (datos.tipo_usuario === "administrador") {
    window.location.href = "panelAdmin.html";
  } else {
    window.location.href = "panelUsuario.html";
  }

}