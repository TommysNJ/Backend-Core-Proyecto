import express from 'express';
import { registerUser, loginUser, deleteUser } from '../controllers/UserController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Ruta para registrar usuarios (alumnos, instructores)
router.post('/register', registerUser);

// Ruta para hacer login
router.post('/login', loginUser);

router.delete('/delete/:email', verifyToken, verifyRole([3]), deleteUser);

export default router;