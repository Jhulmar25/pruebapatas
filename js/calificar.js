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

const backendURL = "https://red-de-patas-api-812893065625.us-central1.run.app";

// ================================
// 2. Selección de estrellas
// ================================
let estrellasSeleccionadas = 0;

document.querySelectorAll(".estrellas span").forEach((star, i) => {
  star.addEventListener("click", () => {
    estrellasSeleccionadas = i + 1;

    document.querySelectorAll(".estrellas span").forEach(s => s.classList.remove("active"));
    for (let j = 0; j <= i; j++) {
      document.querySelectorAll(".estrellas span")[j].classList.add("active");
    }
  });
});

// ================================
// 3. Enviar calificación
// ================================
document.getElementById("btnEnviar").addEventListener("click", async () => {

  const ciudadanoNombre = document.getElementById("ciudadanoNombre").value.trim();
  const ciudadanoDni = document.getElementById("ciudadanoDni").value.trim();
  const comentario = document.getElementById("comentario").value.trim();

  if (!estrellasSeleccionadas) {
    return alert("Selecciona una cantidad de estrellas.");
  }

  if (!ciudadanoNombre || !ciudadanoDni) {
    return alert("Ingresa tu nombre y DNI.");
  }

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
    document.getElementById("mensaje").textContent =
      `Gracias por calificar ⭐ Promedio: ${data.promedio} (${data.votos} votos)`;

    document.getElementById("btnEnviar").style.display = "none";
  } else {
    alert("Error enviando calificación.");
  }
});

// ================================
// 4. Volver a credencial
// ================================
document.getElementById("btnVolver").addEventListener("click", () => {
  window.location.href = `index.html#${codigo}`;
});
