// js/calificar.js

// 1. Obtener el código desde la URL
const url = new URL(window.location.href);
const codigo = url.searchParams.get("codigo");

document.getElementById("codigoTexto").textContent = `Código: ${codigo}`;

// 2. Sistema de estrellas
const estrellasDiv = document.getElementById("estrellasContainer");
let estrellasSeleccionadas = 5;

estrellasDiv.addEventListener("click", (e) => {
  if (e.target.textContent === "★") {
    const index = [...estrellasDiv.textContent].indexOf(e.target.textContent);
    estrellasSeleccionadas = [...estrellasDiv.textContent].indexOf(e.target) + 1;
  }
});

estrellasDiv.addEventListener("mousemove", (e) => {
  if (e.target.textContent === "★") {
    let pos = [...estrellasDiv.children].indexOf(e.target);
  }
});

// 3. Enviar al backend
document.getElementById("btnEnviarCalificacion").addEventListener("click", async () => {

  const ciudadanoNombre = document.getElementById("ciudadanoNombre").value.trim();
  const ciudadanoDni = document.getElementById("ciudadanoDni").value.trim();
  const comentario = document.getElementById("comentario").value.trim();

  if (!ciudadanoNombre || !ciudadanoDni) {
    alert("Debes completar tu nombre y DNI");
    return;
  }

  const backendURL = "https://red-de-patas-api-812893065625.us-central1.run.app/api/calificar";

  try {
    const resp = await fetch(`${backendURL}/${codigo}`, {
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

    if (!data.ok) {
      alert("⚠️ Error guardando calificación");
      return;
    }

    alert(`✔ Calificación enviada\nPromedio actual: ${data.promedio} ⭐`);

    window.location.href = `index.html#${codigo}`;

  } catch (err) {
    console.error(err);
    alert("⚠️ Error enviando al servidor.");
  }
});

// 4. Volver
document.getElementById("btnVolver").addEventListener("click", () => {
  window.location.href = `index.html#${codigo}`;
});
