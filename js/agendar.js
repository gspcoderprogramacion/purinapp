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
   🐾 CARGAR MASCOTAS DEL USUARIO
================================= */

async function cargarMascotas(uid) {

  const mascotaSelect = document.getElementById("mascotaSelect");
  mascotaSelect.innerHTML = "<option value=''>Seleccione su mascota</option>";

  try {

    const q = query(
      collection(db, "Mascotas"),
      where("propietario_id", "==", uid)
    );

    const snapshot = await getDocs(q);

    console.log("Mascotas encontradas:", snapshot.size);

    if (snapshot.empty) {
      const option = document.createElement("option");
      option.textContent = "No tienes mascotas registradas";
      option.disabled = true;
      mascotaSelect.appendChild(option);
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();

      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = `${data.nombre} (${data.especie})`;

      mascotaSelect.appendChild(option);
    });

  } catch (error) {
    console.error("Error cargando mascotas:", error);
  }
}


/* ===============================
   📅 CARGAR HORARIOS DISPONIBLES
================================= */

async function cargarHorariosDisponibles() {

  const fechaSeleccionada = document.getElementById("fecha").value;
  const selectHora = document.getElementById("hora");

  selectHora.innerHTML = "";

  if (!fechaSeleccionada) return;

  const partes = fechaSeleccionada.split("-");
  const fechaObj = new Date(
    partes[0],
    partes[1] - 1,
    partes[2]
  );

  const diaSemana = fechaObj.getDay();

  // ❌ Domingo
  if (diaSemana === 0) {
    const option = document.createElement("option");
    option.textContent = "No atendemos domingos";
    option.disabled = true;
    option.selected = true;
    selectHora.appendChild(option);
    return;
  }

  const q = query(
    collection(db, "citas"),
    where("fecha", "==", fechaSeleccionada)
  );

  const snapshot = await getDocs(q);

  const horasOcupadas = [];
  snapshot.forEach(doc => {
    horasOcupadas.push(doc.data().hora);
  });

  let horaInicio = 9;
  let horaFin = (diaSemana === 6) ? 12 : 18; // sábado hasta 12

  for (let hora = horaInicio; hora <= horaFin; hora++) {

    let horaFormateada = String(hora).padStart(2, "0") + ":00";

    if (!horasOcupadas.includes(horaFormateada)) {
      const option = document.createElement("option");
      option.value = horaFormateada;
      option.textContent = horaFormateada;
      selectHora.appendChild(option);
    }
  }

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

  const user = auth.currentUser;

  if (!user) {
    alert("Usuario no autenticado");
    return;
  }

  const mascotaId = document.getElementById("mascotaSelect").value;
  const motivo = document.getElementById("motivo").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;

  if (!mascotaId || !fecha || !hora) {
    alert("Completa todos los campos");
    return;
  }

  try {

    const cita = {
      propietario_id: user.uid,
      mascota_id: mascotaId,
      motivo,
      fecha,
      hora,
      estado: "pendiente",
      createdAt: new Date()
    };

    await addDoc(collection(db, "citas"), cita);

    alert("Cita agendada correctamente ✅");

    document.getElementById("mascotaSelect").value = "";
    document.getElementById("motivo").value = "";
    document.getElementById("fecha").value = "";
    document.getElementById("hora").innerHTML = "";

  } catch (error) {
    console.error("Error al guardar:", error);
    alert("Error al guardar la cita");
  }
};


/* ===============================
   🎯 EVENTOS
================================= */

document.addEventListener("DOMContentLoaded", () => {

  const inputFecha = document.getElementById("fecha");

  if (inputFecha) {
    inputFecha.addEventListener("change", cargarHorariosDisponibles);
  }

  // 🔥 ESPERAR A QUE FIREBASE RESTAURE SESIÓN
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Usuario autenticado:", user.uid);
      cargarMascotas(user.uid);
    } else {
      console.log("No hay usuario autenticado");
    }
  });

});