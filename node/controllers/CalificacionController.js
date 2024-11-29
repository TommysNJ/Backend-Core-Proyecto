import CalificacionModel from "../models/CalificacionModel.js";

// Calificar un curso (solo alumno)
export const rateCourse = async (req, res) => {
    try {
        const { id_inscripcion, puntuacion, descripcion } = req.body;
        // validación
        if (puntuacion < 0 || puntuacion > 10) {
            return res.status(400).json({
                message: "La puntuación debe estar entre 0 y 10",
            });
        }
        await CalificacionModel.create({
            id_inscripcion,
            puntuacion,
            descripcion
        });
        res.json({ message: "Calificación guardada correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ver la calificación de un curso (solo alumno)
export const getCalificacion = async (req, res) => {
    try {
        const { id_inscripcion } = req.params;
        const calificacion = await CalificacionModel.findOne({ where: { id_inscripcion } });
        res.json(calificacion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar la calificación de un curso (solo alumno)
export const updateCalificacion = async (req, res) => {
    try {
        const { id_inscripcion } = req.params;
        const { puntuacion, descripcion } = req.body;

        // validación
        if (puntuacion < 0 || puntuacion > 10) {
            return res.status(400).json({
                message: "La puntuación debe estar entre 0 y 10",
            });
        }

        // Verificar si existe una calificación asociada a la inscripción
        const calificacion = await CalificacionModel.findOne({ where: { id_inscripcion } });
        if (!calificacion) {
            return res.status(404).json({ message: "Calificación no encontrada" });
        }

        // Actualizar la calificación
        await CalificacionModel.update({ puntuacion, descripcion }, { where: { id_inscripcion } });

        res.json({ message: "Calificación actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};