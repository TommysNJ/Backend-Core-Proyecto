import express from "express";
import { verifyToken, verifyRole } from "../middleware/auth.js";
import { getPopularidadTemas } from "../controllers/ReportController.js";

const router = express.Router();

// Ruta para el reporte de popularidad de temáticas
router.get("/popularidad-temas", verifyToken, verifyRole([3]), getPopularidadTemas);

export default router;