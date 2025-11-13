import { db } from "../backend/firebase.js";
import { doc, getDoc } from "firebase/firestore";

// ===============================
// 1. LEER EL CÓDIGO DESDE EL QR
// ===============================
const hash = window.location.hash.substring(1); 
// Ejemplo:  #C41TF593  →  "C41TF593"

const codigo = hash && hash.trim();
if (!codigo) mostrarError("QR inválido o incompleto.");


// ===============================
// 2. FUNCIÓN PRINCIPAL
// ===============================
async function cargarPaseador() {
    try {
        const ref = doc(db, "Paseadores", codigo);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            mostrarError("❌ Credencial NO está registrada en el sistema.");
            return;
        }

        const datos = snap.data();

        // ===============================
        // 3. MOSTRAR DATOS EN LA CREDENCIAL
        // ===============================

        document.getElementById("nombre").textContent =
            datos.nombre || "—";

        document.getElementById("dni").textContent =
            datos.dni || "—";

        document.getElementById("telefono").textContent =
            datos.telefono || "—";

        document.getElementById("foto").src =
            datos.foto || "https://via.placeholder.com/150x170";

    } catch (err) {
        console.error(err);
        mostrarError("⚠️ Error al conectarse con el servidor.");
    }
}


// ===============================
// 4. FUNCIÓN DE ERROR
// ===============================
function mostrarError(msg) {
    document.getElementById("nombre").textContent = "—";
    document.getElementById("dni").textContent = "—";
    document.getElementById("telefono").textContent = "—";
    alert(msg);
}

cargarPaseador();
