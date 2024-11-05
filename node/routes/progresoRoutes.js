import express from 'express';
import { updateProgreso, getProgreso } from '../controllers/ProgresoController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Rutas para actualizar y ver progreso (solo alumnos)
router.post('/', verifyToken, verifyRole([1]), updateProgreso); // Solo alumnos actualizan progreso
router.get('/:id_inscripcion', verifyToken, verifyRole([1]), getProgreso); // Solo alumnos ven el progreso

export default router;