document.addEventListener("DOMContentLoaded", async () => {

  const urlParams = new URLSearchParams(window.location.search);
  const codigo = urlParams.get("codigo");

  if (!codigo) {
    alert("Código inválido");
    return;
  }

  const backendURL =
    "https://red-de-patas-api-812893065625.us-central1.run.app/api/comentarios";

  try {
    const resp = await fetch(`${backendURL}/${codigo}`);
    const data = await resp.json();

    const contenedor = document.getElementById("listaComentarios");

    if (!data.ok || data.comentarios.length === 0) {
      contenedor.innerHTML = `<p class="sin">Sin comentarios aún</p>`;
      return;
    }

    contenedor.innerHTML = "";

    data.comentarios.forEach(c => {
      const div = document.createElement("div");
      div.classList.add("comentario");

      div.innerHTML = `
        <div class="info">
          <strong>${c.ciudadanoNombre}</strong>  
          <div class="estrellas">${"⭐".repeat(c.estrellas)}</div>
        </div>

        <p class="texto">${c.comentario}</p>

        <small class="fecha">${
          new Date(c.fecha).toLocaleString()
        }</small>
      `;

      contenedor.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    document.getElementById("listaComentarios").innerHTML =
      `<p class="sin">⚠️ Error al cargar comentarios</p>`;
  }

  document.getElementById("btnVolver").addEventListener("click", () => {
    history.back();
  });

});
