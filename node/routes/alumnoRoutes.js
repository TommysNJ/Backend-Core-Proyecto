import express from 'express';
import { createAlumno, getAllAlumnos, getAlumnoByEmail, updateAlumno, deleteAlumno } from '../controllers/AlumnoController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Administrador puede gestionar alumnos
router.post('/', verifyToken, verifyRole([3]), createAlumno); // no va a ser necesario
router.get('/', verifyToken, verifyRole([3]), getAllAlumnos);
router.get('/:email', verifyToken, verifyRole([3, 1]), getAlumnoByEmail); // Ver un alumno por su email (administrador y alumno)
router.put('/:email', verifyToken, verifyRole([3, 1]), updateAlumno);
router.delete('/:email', verifyToken, verifyRole([3]), deleteAlumno); // no va a ser necesario

export default router;