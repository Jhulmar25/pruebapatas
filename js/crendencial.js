// ============================================================
//  CARGA Y VERIFICACIÓN DE CREDENCIAL - RED DE PATAS
//  Autor: Jhulmar Márquez
//  Archivo: credencial.js
// ============================================================

export async function cargarCredencial() {
  const estado = document.getElementById("estado");
  const hash = window.location.hash.substring(1);

  // Validar QR
  if (!hash) {
    mostrarEstado("⚠️ QR no válido o sin datos.", "error");
    return;
  }

  const partes = hash.split("|");
  const codigo = partes[0];
  const apiURL = `https://red-de-patas-api-812893065625.us-central1.run.app/api/verificar/${codigo}`;

  console.log("Consultando:", apiURL);

  try {
    const resp = await fetch(apiURL);

    if (!resp.ok) {
      mostrarEstado(`⚠️ Error al verificar el QR (HTTP ${resp.status})`, "error");
      return;
    }

    const data = await resp.json();
    console.log("Respuesta API:", data);

    if (data.ok) {
      actualizarUI(data);
      mostrarEstado("✅ Credencial verificada", "ok");
    } else {
      mostrarEstado("❌ QR no registrado o falsificado", "error");
    }

  } catch (error) {
    console.error("Error de red:", error);
    mostrarEstado("⚠️ Error al conectar con el servidor", "error");
  }
}

// ============================================================
//  FUNCIÓN: Actualiza los textos, foto y estrellas
// ============================================================
function actualizarUI(data) {
  document.getElementById("nombre").textContent   = data.nombre   || "—";
  document.getElementById("dni").textContent      = data.dni      || "—";
  document.getElementById("telefono").textContent = data.telefono || "—";
  document.getElementById("foto").src             = data.foto     || "https://via.placeholder.com/150x170";

  // ⭐ Calificación dinámica (0 a 5)
  const rating = Number(data.calificacion) || 0;
  const estrellas = "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, 5 - rating);
  document.getElementById("estrellas").textContent = estrellas;
}

// ============================================================
//  FUNCIÓN: Mostrar estado visual
// ============================================================
function mostrarEstado(texto, tipo) {
  const estado = document.getElementById("estado");

  estado.textContent = texto;

  if (tipo === "ok") {
    estado.style.color = "#047857";  // verde
  } else {
    estado.style.color = "#b91c1c";  // rojo
  }
}

// Ejecutar cuando la página cargue
document.addEventListener("DOMContentLoaded", cargarCredencial);
