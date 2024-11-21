import express from "express";
import { verifyToken, verifyRole } from "../middleware/auth.js";
import { getPopularidadTemas, getPorcentajeInscripcionesPorTematica } from "../controllers/ReportController.js";

const router = express.Router();

// Ruta para el reporte de popularidad de temáticas
router.get("/popularidad-temas", verifyToken, verifyRole([3]), getPopularidadTemas);
router.get('/porcentaje-inscripciones', verifyToken, verifyRole([3]), getPorcentajeInscripcionesPorTematica);


export default router;