import express from "express";
import {
    createSubTema,
    getAllSubTemas,
    getSubTemaById,
    updateSubTema,
    deleteSubTema
} from "../controllers/SubTemaController.js";
import { verifyToken, verifyRole } from "../middleware/auth.js";

const router = express.Router();

// Rutas para gestionar subtemáticas
router.post("/", verifyToken, verifyRole([3]), createSubTema); // Crear subtemática
router.get("/", verifyToken, verifyRole([3]), getAllSubTemas); // Ver todas las subtemáticas
router.get("/:id", verifyToken, verifyRole([3]), getSubTemaById); // Ver una subtemática por ID
router.put("/:id", verifyToken, verifyRole([3]), updateSubTema); // Actualizar subtemática
router.delete("/:id", verifyToken, verifyRole([3]), deleteSubTema); // Eliminar subtemática

export default router;