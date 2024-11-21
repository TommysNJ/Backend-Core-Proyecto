import TemaModel from "../models/TemaModel.js";
import CourseModel from "../models/CourseModel.js";
import InscriptionModel from "../models/InscriptionModel.js";
import CalificacionModel from "../models/CalificacionModel.js";

export const getPopularidadTemas = async (req, res) => {
    try {
        // Obtener todas las calificaciones y las inscripciones asociadas
        const calificaciones = await CalificacionModel.findAll({
            include: [
                {
                    model: InscriptionModel,
                    as: 'inscripcion',
                    include: [
                        {
                            model: CourseModel,
                            as: 'curso',
                            include: [
                                {
                                    model: TemaModel,
                                    as: 'tema'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        // Contar el total de inscripciones
        const totalInscripciones = await InscriptionModel.count();

        if (totalInscripciones === 0) {
            return res.status(200).json([]);
        }

        // Mapear las calificaciones por temática
        const temaData = {};

        calificaciones.forEach((calificacion) => {
            const tema = calificacion.inscripcion.curso.tema;
            if (!tema) return;

            const temaId = tema.id_tema;

            if (!temaData[temaId]) {
                temaData[temaId] = {
                    tipo: tema.tipo,
                    descripcion: tema.descripcion,
                    totalInscripciones: 0,
                    sumaCalificaciones: 0,
                    totalCalificaciones: 0
                };
            }

            temaData[temaId].totalInscripciones += 1;

            if (calificacion.puntuacion !== null) {
                temaData[temaId].sumaCalificaciones += parseFloat(calificacion.puntuacion);
                temaData[temaId].totalCalificaciones += 1;
            }
        });

        // Calcular los datos finales para cada tema
        const popularidadTemas = Object.values(temaData).map((tema) => {
            const promedioCalificaciones =
                tema.totalCalificaciones > 0 ? tema.sumaCalificaciones / tema.totalCalificaciones : 0;

            const porcentajeInscripciones = (tema.totalInscripciones / totalInscripciones) * 100;

            return {
                tipo: tema.tipo,
                descripcion: tema.descripcion,
                promedioCalificaciones: promedioCalificaciones.toFixed(2),
                porcentajeInscripciones: porcentajeInscripciones.toFixed(2) + "%",
                indicePopularidad: (
                    promedioCalificaciones * (porcentajeInscripciones / 100)
                ).toFixed(2)
            };
        });

        // Ordenar los temas por índice de popularidad descendente
        popularidadTemas.sort((a, b) => b.indicePopularidad - a.indicePopularidad);

        res.json(popularidadTemas);
    } catch (error) {
        console.error("Error generando el reporte de popularidad:", error);
        res.status(500).json({ message: "Error generando el reporte de popularidad" });
    }
};