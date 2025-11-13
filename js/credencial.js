// js/credencial.js

document.addEventListener("DOMContentLoaded", async () => {

  const hash = window.location.hash.substring(1);

  // ej: "C41TF593|63023960|Vizcarra"
  const codigo = hash.split("|")[0];

  if (!codigo) {
    alert("QR inválido");
    return;
  }

  const backendURL = "https://red-de-patas-api-812893065625.us-central1.run.app/api/verificar";

  try {
    const resp = await fetch(`${backendURL}/${codigo}`);

    if (!resp.ok) {
      alert("❌ Credencial NO registrada.");
      return;
    }

    const data = await resp.json();

    if (!data.ok) {
      alert("❌ Credencial NO registrada.");
      return;
    }

    // Mostrar datos
    document.getElementById("nombre").textContent = data.nombre || "—";
    document.getElementById("dni").textContent = data.dni || "—";
    document.getElementById("telefono").textContent = data.telefono || "—";
    document.getElementById("foto").src = data.foto || "https://placehold.co/150x170";

  } catch (error) {
    console.error(error);
    alert("⚠️ Error conectando con el servidor.");
  }
});
