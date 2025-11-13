// js/credencial.js

document.addEventListener("DOMContentLoaded", async () => {

  let hash = window.location.hash.substring(1);
  let codigo = hash.split("|")[0];

  if (!codigo) {
    alert("QR inválido");
    return;
  }

  // URL real del backend
  const backendURL = "https://red-de-patas-api-812893065625.us-central1.run.app/api/verificar";

  try {
    const resp = await fetch(`${backendURL}/${codigo}`);
    const data = await resp.json();

    if (!data.ok) {
      alert("❌ Esta credencial NO está registrada.");
      return;
    }

    // Mostrar datos
    document.getElementById("nombre").textContent = data.nombre || "—";
    document.getElementById("dni").textContent = data.dni || "—";
    document.getElementById("telefono").textContent = data.telefono || "—";

    // Foto desde Firebase Storage
    document.getElementById("foto").src =
      data.foto || "https://placehold.co/150x170";

  } catch (error) {
    console.error(error);
    alert("⚠️ Error conectando con el servidor.");
  }
});
