import { db } from "./firebaseConfig.js";
import { collection, getDocs, query, where, addDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// 🔹 Cargar horarios disponibles
async function cargarHorariosDisponibles() {

  const fechaSeleccionada = document.getElementById("fecha").value;
  const selectHora = document.getElementById("hora");

  selectHora.innerHTML = "";

  if (!fechaSeleccionada) return;

  // 🔥 SOLUCIÓN DEFINITIVA ZONA HORARIA
  const partes = fechaSeleccionada.split("-");
  const fechaObj = new Date(
    partes[0],
    partes[1] - 1,
    partes[2]
  );

  const diaSemana = fechaObj.getDay();
  // 0 = Domingo
  // 6 = Sábado

  // ❌ DOMINGO → no mostrar nada
  if (diaSemana === 0) {
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
    // 🟡 SÁBADO
    horaFin = 12;
  } else {
    // 🟢 LUNES A VIERNES
    horaFin = 18;
  }

  // ⏰ Intervalos cada 1 hora (incluye la última hora)
  for (let hora = horaInicio; hora <= horaFin; hora++) {

    let horaFormateada = String(hora).padStart(2, "0") + ":00";

    if (!horasOcupadas.includes(horaFormateada)) {
      const option = document.createElement("option");
      option.value = horaFormateada;
      option.textContent = horaFormateada;
      selectHora.appendChild(option);
    }
  }

  // Si no quedan horarios disponibles
  if (selectHora.innerHTML === "") {
    const option = document.createElement("option");
    option.textContent = "No hay horarios disponibles";
    option.disabled = true;
    option.selected = true;
    selectHora.appendChild(option);
  }
}


// 🔹 Guardar cita
window.guardarCita = async function() {

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

  const cita = {
    nombre,
    telefono,
    direccion,
    especie,
    mascota,
    motivo,
    fecha,
    hora,
    estado: "pendiente"
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
};


// 🔹 Activar evento cuando cambie la fecha
document.addEventListener("DOMContentLoaded", () => {

  const inputFecha = document.getElementById("fecha");

  if (inputFecha) {
    inputFecha.addEventListener("change", cargarHorariosDisponibles);
  }

});