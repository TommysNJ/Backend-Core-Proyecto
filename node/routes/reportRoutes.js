import express from "express";
import { verifyToken, verifyRole } from "../middleware/auth.js";
import { getPopularidadTemas, getPorcentajeInscripcionesPorTematica, getPopularidadTemasConFiltros, getPopularidadSubtematicasPorInstructor } from "../controllers/ReportController.js";

const router = express.Router();

// Ruta para el reporte de popularidad de temáticas
router.get("/popularidad-temas", verifyToken, verifyRole([3]), getPopularidadTemas);
router.get('/porcentaje-inscripciones', verifyToken, verifyRole([3]), getPorcentajeInscripcionesPorTematica);
router.get("/popularidad-temas-filtros", verifyToken, verifyRole([3]), getPopularidadTemasConFiltros);
// Ruta para el reporte de popularidad de subtemáticas por instructor
router.get("/popularidad-subtematicas-instructor", verifyToken, verifyRole([3]), getPopularidadSubtematicasPorInstructor);

export default router;