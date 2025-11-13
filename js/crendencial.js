// =========================
//   LEER DATOS DEL QR
// =========================
const hash = window.location.hash.substring(1);
const partes = hash.split("|");

if (partes.length !== 3) {
    mostrarError("QR inválido o incompleto");
} else {
    const codigo = partes[0];
    const dni = partes[1];
    const nombre = decodeURIComponent(partes[2]);

    // Mostrar datos iniciales
    document.getElementById("nombre").textContent = nombre;
    document.getElementById("dni").textContent = dni;

    // Mostrar foto (desde Firebase Storage)
    const fotoURL = `https://firebasestorage.googleapis.com/v0/b/red-de-patas.firebasestorage.app/o/paseadores%20de%20perros%2F${codigo}.jpg?alt=media`;

    document.getElementById("fotoPaseador").src = fotoURL;

    // Consultar API para obtener celular
    obtenerDatos(codigo);
}


// =========================
//   CONSULTAR FIRESTORE API
// =========================
async function obtenerDatos(codigo) {
    try {
        const apiURL = `https://red-de-patas-api-812893065625.us-central1.run.app/paseador/${codigo}`;
        const resp = await fetch(apiURL);

        if (!resp.ok) throw new Error("No existe");

        const data = await resp.json();

        document.getElementById("cel").textContent = data.telefono || "No registrado";

    } catch (err) {
        mostrarError("No se encontró el paseador en la base de datos");
    }
}


// =========================
//   MANEJO DE ERRORES
// =========================
function mostrarError(msg) {
    document.getElementById("nombre").textContent = "—";
    document.getElementById("dni").textContent = "—";
    document.getElementById("cel").textContent = "—";

    const cred = document.querySelector(".credencial");

    cred.innerHTML += `
        <p style="color:red; font-weight:bold; margin-top:15px;">
            ⚠️ ${msg}
        </p>
    `;
}
