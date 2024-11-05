import express from 'express';
import { rateCourse, getCalificacion, updateCalificacion } from '../controllers/CalificacionController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Rutas para calificar un curso y obtener la calificación (solo alumnos)
router.post('/', verifyToken, verifyRole([1]), rateCourse); // Solo alumnos califican
router.get('/:id_inscripcion', verifyToken, verifyRole([1]), getCalificacion); // Solo alumnos ven la calificación
router.put('/:id_inscripcion', verifyToken, verifyRole([1]), updateCalificacion); // Solo alumnos actualizan la calificación

export default router;