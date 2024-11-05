import express from 'express';
import { createInscripcion, getInscripcionesAlumno } from '../controllers/InscripcionController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Inscribirse en un curso (solo alumnos)
router.post('/', verifyToken, verifyRole([1]), createInscripcion);

// Ver todas las inscripciones del alumno (solo alumnos)
router.get('/:email_alumno', verifyToken, verifyRole([1]), getInscripcionesAlumno);

export default router;