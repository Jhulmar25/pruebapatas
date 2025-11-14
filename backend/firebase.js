/**
 * 🔥 API BACKEND — RED DE PATAS
 * Autor: Jhulmar Márquez (2025)
 * Descripción: API segura para verificar credenciales desde Firestore.
 */

import express from "express";
import cors from "cors";
import admin from "firebase-admin";

// ============================================================
// 🔒 CONFIGURACIÓN DE CREDENCIALES SEGURA
// ============================================================

const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT;
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

let credentials;
if (serviceAccountBase64) {
  const decoded = Buffer.from(serviceAccountBase64, "base64").toString("utf8");
  credentials = admin.credential.cert(JSON.parse(decoded));
  console.log("✅ Credenciales cargadas desde variable BASE64");
} else if (serviceAccountPath) {
  credentials = admin.credential.cert(serviceAccountPath);
  console.log("✅ Credenciales cargadas desde archivo local");
} else {
  console.error("❌ ERROR: No se encontraron credenciales de Firebase.");
  process.exit(1);
}

// ============================================================
// 🔧 INICIALIZAR FIREBASE ADMIN
// ============================================================
admin.initializeApp({
  credential: credentials,
  storageBucket: "red-de-patas.firebasestorage.app"
});

const db = admin.firestore();
const app = express();
app.use(express.json()); // ⛔ NECESARIO PARA LEER req.body

// ============================================================
// 🌐 CORS
// ============================================================
app.use(
  cors({
    origin: [
      "https://jhulmar25.github.io",
      "http://localhost:5173",
      "http://localhost:8080"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);

// ============================================================
// ⭐ RUTA: OBTENER PROMEDIO DE CALIFICACIONES
// ============================================================
app.get("/api/promedio/:codigo", async (req, res) => {
  const { codigo } = req.params;

  try {
    const calRef = db
      .collection("Calificaciones")
      .doc(codigo)
      .collection("Calificaciones");

    const snap = await calRef.get();

    // Si NO tiene calificaciones
    if (snap.empty) {
      return res.json({
        ok: true,
        promedio: 0,
        votos: 0
      });
    }

    // Sumar estrellas
    let suma = 0;
    let cantidad = snap.size;

    snap.forEach((doc) => {
      suma += Number(doc.data().estrellas);
    });

    const promedio = suma / cantidad;

    res.json({
      ok: true,
      promedio: Number(promedio.toFixed(1)),
      votos: cantidad
    });

  } catch (err) {
    console.error("Error al obtener promedio:", err);
    res.status(500).json({
      ok: false,
      mensaje: "⚠️ Error interno al calcular promedio"
    });
  }
});


// ============================================================
// 🧩 RUTA: VERIFICAR CREDENCIAL
// ============================================================
app.get("/api/verificar/:codigo", async (req, res) => {
  const { codigo } = req.params;

  try {
    if (!codigo)
      return res
        .status(400)
        .json({ ok: false, mensaje: "Código no proporcionado" });

    const ref = db.collection("Paseadores").doc(codigo);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).json({
        ok: false,
        mensaje: "❌ Credencial no registrada o falsificada"
      });
    }

    const data = snap.data();
    res.json({
      ok: true,
      codigo: data.codigo,
      dni: data.dni,
      nombre: data.nombre,
      telefono: data.telefono,
      foto: data.foto
    });
  } catch (error) {
    console.error("Error /api/verificar:", error);
    res.status(500).json({ ok: false, mensaje: "⚠️ Error del servidor" });
  }
});

// ============================================================
// ⭐ RUTA: GUARDAR CALIFICACIÓN
// ============================================================
app.post("/api/calificar/:codigo", async (req, res) => {
  const { codigo } = req.params;
  const { ciudadanoNombre, ciudadanoDni, estrellas, comentario } = req.body;

  if (!codigo || !estrellas || !ciudadanoDni || !ciudadanoNombre) {
    return res
      .status(400)
      .json({ ok: false, mensaje: "Datos incompletos" });
  }

  try {
    const calRef = db
      .collection("Calificaciones")
      .doc(codigo)
      .collection("Calificaciones");

    // 1) Guardar calificación
    await calRef.add({
      ciudadanoNombre,
      ciudadanoDni,
      estrellas,
      comentario,
      fecha: new Date().toISOString()
    });

    // 2) Calcular nuevo promedio
    const snap = await calRef.get();
    let suma = 0;
    let cantidad = snap.size;

    snap.forEach((doc) => {
      suma += doc.data().estrellas;
    });

    const promedio = cantidad > 0 ? suma / cantidad : 0;

    res.json({
      ok: true,
      promedio: Number(promedio.toFixed(1)),
      votos: cantidad
    });
  } catch (err) {
    console.error("Error al guardar calificación:", err);
    res.status(500).json({
      ok: false,
      mensaje: "⚠️ Error en el servidor"
    });
  }
});

// ============================================================
// RUTA DE SALUD
// ============================================================
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "API Red de Patas",
    ts: new Date().toISOString()
  });
});

// ============================================================
// 🚀 INICIAR SERVIDOR
// ============================================================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`✅ Servidor corriendo en puerto ${PORT}`)
);
