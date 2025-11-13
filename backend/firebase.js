/**
 * 🔥 API BACKEND — RED DE PATAS
 * Autor: Jhulmar Márquez (2025)
 * Descripción: API segura para verificar credenciales desde Firestore.
 * Uso: NODE_ENV=production node backend/firebase.js
 */

import express from "express";
import cors from "cors";
import admin from "firebase-admin";

// ============================================================
// 🔒 CONFIGURACIÓN DE CREDENCIALES SEGURA
// ============================================================
// En producción, NO subas el archivo JSON al repositorio.
// Usa una variable de entorno:
// FIREBASE_SERVICE_ACCOUNT = <contenido BASE64 de tu JSON>
// o bien GOOGLE_APPLICATION_CREDENTIALS = "/ruta/al/archivo.json"

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

// ============================================================
// 🌐 CONFIGURAR CORS (solo tu dominio autorizado)
// ============================================================
app.use(cors({
  origin: [
    "https://jhulmar25.github.io",
    "http://localhost:5173",
    "http://localhost:8080"
  ],
  methods: ["GET"],
  allowedHeaders: ["Content-Type"]
}));

// ============================================================
// 🧩 RUTA PRINCIPAL: /api/verificar/:codigo
// ============================================================
app.get("/api/verificar/:codigo", async (req, res) => {
  const { codigo } = req.params;
  try {
    if (!codigo) return res.status(400).json({ ok: false, mensaje: "Código no proporcionado" });

    const ref = db.collection("Paseadores").doc(codigo);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).json({ ok: false, mensaje: "❌ Credencial no registrada o falsificada" });
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
    res.status(500).json({ ok: false, mensaje: "⚠️ Error interno del servidor" });
  }
});

// ============================================================
// 🩺 RUTA DE SALUD (para probar si está activa)
// ============================================================
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "API Red de Patas", ts: new Date().toISOString() });
});

// ============================================================
// 🚀 INICIAR SERVIDOR
// ============================================================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en puerto ${PORT}`));
