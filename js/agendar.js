import { db, auth } from "./firebaseConfig.js";

import { 
  collection, 
  getDocs, 
  query, 
  where, 
  addDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


/* ===============================
   🔐 CONTROL DE SESIÓN
================================= */

let usuarioActual = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    usuarioActual = user;
    console.log("Usuario logueado:", user.uid);
  } else {
    // Si no hay sesión, redirige al login
    window.location.href = "login.html";
  }
});


/* ===============================
   📅 CARGAR HORARIOS DISPONIBLES
================================= */

async function cargarHorariosDisponibles() {

  const fechaSeleccionada = document.getElementById("fecha").value;
  const selectHora = document.getElementById("hora");

  selectHora.innerHTML = "";

  if (!fechaSeleccionada) return;

  // 🔥 Manejo correcto de zona horaria
  const partes = fechaSeleccionada.split("-");
  const fechaObj = new Date(
    partes[0],
    partes[1] - 1,
    partes[2]
  );

  const diaSemana = fechaObj.getDay();
  // 0 = Domingo
  // 6 = Sábado

  // ❌ Domingo → no atención
  if (diaSemana === 0) {
    const option = document.createElement("option");
    option.textContent = "No atendemos domingos";
    option.disabled = true;
    option.selected = true;
    selectHora.appendChild(option);
    return;
  }

  // 🔎 Consultar citas ya ocupadas ese día
  const q = query(
    collection(db, "citas"),
    where("fecha", "==", fechaSeleccionada)
  );

  const snapshot = await getDocs(q);

  const horasOcupadas = [];
  snapshot.forEach(doc => {
    horasOcupadas.push(doc.data().hora);
  });

  // 🔥 Definir horario según el día
  let horaInicio = 9;
  let horaFin;

  if (diaSemana === 6) {
    // 🟡 Sábado
    horaFin = 12;
  } else {
    // 🟢 Lunes a Viernes
    horaFin = 18;
  }

  // ⏰ Intervalos cada 1 hora
  for (let hora = horaInicio; hora <= horaFin; hora++) {

    let horaFormateada = String(hora).padStart(2, "0") + ":00";

    if (!horasOcupadas.includes(horaFormateada)) {
      const option = document.createElement("option");
      option.value = horaFormateada;
      option.textContent = horaFormateada;
      selectHora.appendChild(option);
    }
  }

  // Si no quedan horarios
  if (selectHora.innerHTML === "") {
    const option = document.createElement("option");
    option.textContent = "No hay horarios disponibles";
    option.disabled = true;
    option.selected = true;
    selectHora.appendChild(option);
  }
}


/* ===============================
   💾 GUARDAR CITA
================================= */

window.guardarCita = async function() {

  if (!usuarioActual) {
    alert("Debe iniciar sesión");
    return;
  }

  const nombre = document.getElementById("nombre").value;
  const telefono = document.getElementById("telefono").value;
  const direccion = document.getElementById("direccion").value;
  const especie = document.getElementById("especie").value;
  const mascota = document.getElementById("mascota").value;
  const motivo = document.getElementById("motivo").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;

  if (!fecha || !hora) {
    alert("Selecciona fecha y hora");
    return;
  }

  try {

    const cita = {
      userId: usuarioActual.uid,  // 🔥 ID del usuario
      nombre,
      telefono,
      direccion,
      especie,
      mascota,
      motivo,
      fecha,
      hora,
      estado: "pendiente",
      createdAt: new Date()
    };

    await addDoc(collection(db, "citas"), cita);

    alert("Cita agendada correctamente ✅");

    // 🔥 Limpiar formulario
    document.getElementById("nombre").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("direccion").value = "";
    document.getElementById("especie").value = "";
    document.getElementById("mascota").value = "";
    document.getElementById("motivo").value = "";
    document.getElementById("fecha").value = "";
    document.getElementById("hora").innerHTML = "";

  } catch (error) {
    console.error("Error al guardar:", error);
    alert("Error al guardar la cita");
  }
};


/* ===============================
   🎯 EVENTO FECHA
================================= */

document.addEventListener("DOMContentLoaded", () => {

  const inputFecha = document.getElementById("fecha");

  if (inputFecha) {
    inputFecha.addEventListener("change", cargarHorariosDisponibles);
  }

});