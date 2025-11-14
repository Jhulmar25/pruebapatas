// js/calificar.js

// ================================
// 1. Obtener código desde la URL
// ================================
const params = new URLSearchParams(window.location.search);
const codigo = params.get("codigo");

if (!codigo) {
  alert("Código inválido");
  window.location.href = "index.html";
}

document.getElementById("codigoTexto").textContent = `Código: ${codigo}`;

// URL de tu backend
const backendURL = "https://red-de-patas-api-812893065625.us-central1.run.app";


// ================================
// 2. Manejo de estrellas
// ================================
let estrellasSeleccionadas = 0;

document.querySelectorAll(".estrellas span").forEach((star, index) => {
  star.addEventListener("click", () => {

    estrellasSeleccionadas = index + 1;

    // Resetear
    document.querySelectorAll(".estrellas span").forEach(s => s.classList.remove("active"));

    // Activar seleccionadas
    for (let i = 0; i <= index; i++) {
      document.querySelectorAll(".estrellas span")[i].classList.add("active");
    }
  });
});


// ================================
// 3. Enviar calificación al backend
// ================================
document.getElementById("btnEnviar").addEventListener("click", async () => {

  const ciudadanoNombre = document.getElementById("ciudadanoNombre").value.trim();
  const ciudadanoDni = document.getElementById("ciudadanoDni").value.trim();
  const comentario = document.getElementById("comentario").value.trim();

  // VALIDACIONES
  if (!estrellasSeleccionadas) {
    alert("Selecciona una cantidad de estrellas.");
    return;
  }

  if (!ciudadanoNombre || !ciudadanoDni) {
    alert("Ingresa tu nombre y DNI.");
    return;
  }

  try {

    const resp = await fetch(`${backendURL}/api/calificar/${codigo}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ciudadanoNombre,
        ciudadanoDni,
        estrellas: estrellasSeleccionadas,
        comentario
      })
    });

    const data = await resp.json();

  if (data.ok) {

  // 1. Ocultar formulario completo
  document.querySelector(".calificar-container").style.display = "none";

  // 2. Mostrar pantalla de agradecimiento
  const pantalla = document.getElementById("pantallaGracias");
  pantalla.style.display = "flex";

  // 3. Redirigir automáticamente en 2 segundos
  setTimeout(() => {
    window.location.href = `index.html#${codigo}`;
  }, 2000);

} else {
      alert("⚠️ Error guardando la calificación.");
    }

  } catch (err) {
    console.error(err);
    alert("⚠️ Error conectando con el servidor.");
  }
});


// ================================
// 4. Botón volver
// ================================
document.getElementById("btnVolver").addEventListener("click", () => {
  window.location.href = `index.html#${codigo}`;
});

