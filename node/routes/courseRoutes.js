import express from 'express';
import { createCourse, getAllCourses, getCourseById, getInstructorCourses, updateCourse, deleteCourse, getCourseStudents } from '../controllers/CourseController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Administrador puede gestionar cursos
router.post('/', verifyToken, verifyRole([3]), createCourse);
router.get('/', verifyToken, verifyRole([3, 2, 1]), getAllCourses); // Administrador e instructor pueden ver los cursos
router.get('/:id', verifyToken, verifyRole([3, 2]), getCourseById); // Ver curso por ID
router.put('/:id', verifyToken, verifyRole([3]), updateCourse);
router.delete('/:id', verifyToken, verifyRole([3]), deleteCourse);

// Instructores pueden ver sus propios cursos y los alumnos inscritos en ellos
router.get('/instructor/:email', verifyToken, verifyRole([3, 2]), getInstructorCourses);
router.get('/students/:id_curso', verifyToken, verifyRole([2]), getCourseStudents);

export default router;