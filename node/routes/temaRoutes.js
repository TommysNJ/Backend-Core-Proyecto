import express from 'express';
import { createTema, getAllTemas, getTemaById, updateTema, deleteTema } from '../controllers/TemaController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, verifyRole([3]), createTema); // Solo administrador
router.get('/', verifyToken, verifyRole([3]), getAllTemas); // Solo administrador
router.get('/:id', verifyToken, verifyRole([3]), getTemaById); // Solo administrador
router.put('/:id', verifyToken, verifyRole([3]), updateTema); // Solo administrador
router.delete('/:id', verifyToken, verifyRole([3]), deleteTema); // Solo administrador

export default router;