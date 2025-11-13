// credencial.js
document.addEventListener("DOMContentLoaded", async () => {
  const hash = window.location.hash.substring(1);
  const codigo = hash.split("|")[0];

  if (!codigo) {
    alert("QR inválido");
    return;
  }

  // URL del backend en Cloud Run
  const backendURL = "https://red-de-patas-api-812893065625.us-central1.run.app/paseador";

  try {
    const resp = await fetch(`${backendURL}?codigo=${codigo}`);
    const data = await resp.json();

    if (!data.ok) {
      alert("❌ Esta credencial NO existe en el sistema.");
      return;
    }

    // Asignar los datos en la tarjeta
    document.getElementById("nombre").textContent = data.nombre;
    document.getElementById("dni").textContent = data.dni;
    document.getElementById("telefono").textContent = data.telefono;

    // Foto desde Firebase Storage
    document.getElementById("foto").src = data.foto;

  } catch (err) {
    console.error(err);
    alert("⚠️ Error conectando con el servidor.");
  }
});
