import { auth } from "./firebaseConfig.js";
import { signOut } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "index.html"; // redirige al login
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
});