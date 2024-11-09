import express from 'express';
import { updateProgreso, getProgreso, deleteProgreso } from '../controllers/ProgresoController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Rutas para actualizar y ver progreso (solo alumnos)
router.post('/', verifyToken, verifyRole([1]), updateProgreso); // Solo alumnos actualizan progreso
router.get('/:id_inscripcion', verifyToken, verifyRole([1, 2]), getProgreso); // Solo alumnos e instructores ven el progreso
router.delete('/:id_detalle', verifyToken, verifyRole([1]), deleteProgreso); // Solo alumnos pueden eliminar su propio progreso

export default router;