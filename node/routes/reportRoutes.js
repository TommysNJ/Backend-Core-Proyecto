import express from 'express';
import { getCalificacionesPorGeneroEdad } from '../controllers/ReportController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Ruta para obtener el reporte de calificaciones por género y edad para un instructor (filtro opcional de curso)
router.get('/calificaciones/genero-edad', verifyToken, verifyRole([2, 3]), getCalificacionesPorGeneroEdad);

export default router;