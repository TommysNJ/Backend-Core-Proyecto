import ProgresoModel from "../models/ProgresoModel.js";

// Actualizar progreso de un curso (solo alumno)
export const updateProgreso = async (req, res) => {
    try {
        const { id_inscripcion, descripcion } = req.body;
        await ProgresoModel.create({
            id_inscripcion,
            descripcion,
            fecha_actualizacion: new Date()
        });
        res.json({ message: "Progreso actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ver el progreso de un curso (solo alumno)
export const getProgreso = async (req, res) => {
    try {
        const { id_inscripcion } = req.params;
        const progreso = await ProgresoModel.findAll({ where: { id_inscripcion } });
        res.json(progreso);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};