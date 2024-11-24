import express from "express";
import { verifyToken, verifyRole } from "../middleware/auth.js";
import { getPopularidadTemas, getPorcentajeInscripcionesPorTematica, getPopularidadTemasConFiltros } from "../controllers/ReportController.js";

const router = express.Router();

// Ruta para el reporte de popularidad de temáticas
router.get("/popularidad-temas", verifyToken, verifyRole([3]), getPopularidadTemas);
router.get('/porcentaje-inscripciones', verifyToken, verifyRole([3]), getPorcentajeInscripcionesPorTematica);
router.get("/popularidad-temas-filtros", verifyToken, verifyRole([3]), getPopularidadTemasConFiltros);


export default router;