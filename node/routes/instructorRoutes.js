import express from 'express';
import { createInstructor, getAllInstructors, getInstructorByEmail, updateInstructor, deleteInstructor } from '../controllers/InstructorController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Administrador puede gestionar instructores
router.post('/', verifyToken, verifyRole([3]), createInstructor);
router.get('/', verifyToken, verifyRole([3]), getAllInstructors);
router.get('/:email', verifyToken, verifyRole([3, 2]), getInstructorByEmail); // Ver un instructor por su email
router.put('/:email', verifyToken, verifyRole([3]), updateInstructor);
router.delete('/:email', verifyToken, verifyRole([3]), deleteInstructor);

export default router;