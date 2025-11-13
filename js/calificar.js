// ============================================================
//  CALIFICAR – Guardar evaluación en Firestore
//  Autor: Jhulmar Márquez
// ============================================================

// 🔥 IMPORTAR FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getFirestore, doc, setDoc, getDoc, collection, addDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ============================================================
//  CONFIG FIREBASE
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyCkNbamNjoe4HjTnu9XyiWojDFzO7KSNUA",
  authDomain: "municipalidad-msi.firebaseapp.com",
  projectId: "municipalidad-msi",
  storageBucket: "municipalidad-msi.firebasestorage.app",
  messagingSenderId: "200816039529",
  appId: "1:200816039529:web:657f6eae3cc2800458b4f8"
};

// Inicializar
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================================
//  OBTENER CÓDIGO DESDE LA URL
// ============================================================
const params = new URLSearchParams(window.location.search);
const codigoPaseador = params.get("codigo");
const dniPaseador = params.get("dni") || "";
const nombrePaseador = params.get("nombre") || "";

// Mostrar en la UI
document.getElementById("codigo").textContent = codigoPaseador;
document.getElementById("dni").textContent = dniPaseador;
document.getElementById("nombre").textContent = nombrePaseador;

// ============================================================
//  FUNCIÓN PARA GUARDAR CALIFICACIÓN
// ============================================================
async function guardarCalificacion() {
  const calificacion = Number(document.querySelector("input[name='estrella']:checked")?.value || 0);
  const comentario = document.getElementById("comentario").value.trim();
  const nombreEvaluador = document.getElementById("nombreEvaluador").value.trim();
  const dniEvaluador = document.getElementById("dniEvaluador").value.trim();

  // ---------------- VALIDACIONES ----------------
  if (calificacion === 0) {
    alert("Seleccione una calificación de estrellas.");
    return;
  }

  if (!nombreEvaluador) {
    alert("Ingrese su nombre.");
    return;
  }

  if (!dniEvaluador || dniEvaluador.length !== 8) {
    alert("Ingrese un DNI válido (8 dígitos).");
    return;
  }

  if (!comentario) {
    alert("Ingrese un comentario.");
    return;
  }

  try {
    // ============================================================
    //  1) Crear/actualizar documento principal del paseador
    // ============================================================
    await setDoc(doc(db, "calificaciones", codigoPaseador), {
      DNI: dniPaseador,
      NOMBRE: nombrePaseador
    }, { merge: true });

    // ============================================================
    //  2) Guardar calificación dentro de SUBCOLECCIÓN: registro
    // ============================================================
    await addDoc(collection(db, "calificaciones", codigoPaseador, "registro"), {
      calificacion,
      comentario,
      nombreEvaluador,
      dniEvaluador,
      timestamp: serverTimestamp()
    });

    alert("¡Gracias por tu calificación!");
    window.location.href = `index.html#${codigoPaseador}`;

  } catch (error) {
    console.error("Error al guardar:", error);
    alert("Error al guardar la calificación.");
  }
}

// ============================================================
//  BOTÓN ENVIAR
// ============================================================
document.getElementById("btnEnviar").addEventListener("click", guardarCalificacion);
