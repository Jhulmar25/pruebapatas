// js/credencial.js

document.addEventListener("DOMContentLoaded", async () => {

  let hash = window.location.hash.substring(1);
  let codigo = hash.split("|")[0];

  if (!codigo) {
    alert("QR inválido");
    return;
  }

  const backendURL = "https://red-de-patas-api-812893065625.us-central1.run.app/api/verificar";

  try {
    const resp = await fetch(`${backendURL}/${codigo}`);
    const data = await resp.json();

    if (!data.ok) {
      alert("❌ Esta credencial NO está registrada.");
      return;
    }

    document.getElementById("nombre").textContent = data.nombre || "—";
    document.getElementById("dni").textContent = data.dni || "—";
    document.getElementById("telefono").textContent = data.telefono || "—";

    document.getElementById("foto").src =
      data.foto || "https://placehold.co/150x170";

  } catch (error) {
    console.error(error);
    alert("⚠️ Error conectando con el servidor.");
  }

  // 🔵 BOTÓN "CALIFICAR"
  document.getElementById("btnCalificar").addEventListener("click", () => {
    window.location.href = `calificar.html?codigo=${codigo}`;
  });

  // 🔵 BOTÓN "VER COMENTARIOS"
  document.getElementById("btnComentarios").addEventListener("click", () => {
    window.location.href = `comentarios.html?codigo=${codigo}`;
  });

});
