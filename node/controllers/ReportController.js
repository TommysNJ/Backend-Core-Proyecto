import TemaModel from "../models/TemaModel.js";
import CourseModel from "../models/CourseModel.js";
import InscriptionModel from "../models/InscriptionModel.js";
import CalificacionModel from "../models/CalificacionModel.js";

export const getPopularidadTemas = async (req, res) => {
    try {
        // Obtener las calificaciones con sus relaciones correctas
        const calificaciones = await CalificacionModel.findAll({
            attributes: ['puntuacion'], // Solo obtenemos las puntuaciones
            include: [
                {
                    model: InscriptionModel,
                    as: 'inscripcion',
                    attributes: ['id_inscripcion'], // Información mínima de la inscripción
                    include: [
                        {
                            model: CourseModel,
                            as: 'curso',
                            attributes: ['id_tema'], // Solo necesitamos el ID del tema
                            include: [
                                {
                                    model: TemaModel,
                                    as: 'tema',
                                    attributes: ['id_tema', 'tipo', 'descripcion'] // Detalles del tema
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        // Crear un mapa para organizar los datos por tema
        const temaData = {};

        calificaciones.forEach((calificacion) => {
            const tema = calificacion.inscripcion.curso.tema;
            if (!tema) return; // Saltamos si no hay tema asociado

            // Inicializar datos del tema si no existen
            if (!temaData[tema.id_tema]) {
                temaData[tema.id_tema] = {
                    tipo: tema.tipo,
                    descripcion: tema.descripcion,
                    totalCalificaciones: 0,
                    sumaPuntuaciones: 0,
                    totalInscripciones: 0
                };
            }

            // Agregar datos al tema correspondiente
            temaData[tema.id_tema].totalCalificaciones += 1;
            temaData[tema.id_tema].sumaPuntuaciones += calificacion.puntuacion || 0;
            temaData[tema.id_tema].totalInscripciones += 1; // Cada calificación corresponde a una inscripción
        });

        // Calcular el índice de popularidad para cada tema
        const totalInscripcionesGlobal = Object.values(temaData).reduce((sum, tema) => sum + tema.totalInscripciones, 0);

        const popularidadTemas = Object.values(temaData).map((tema) => {
            const promedioCalificaciones = tema.sumaPuntuaciones / (tema.totalCalificaciones || 1);
            const porcentajeInscripciones = ((tema.totalInscripciones / (totalInscripcionesGlobal || 1)) * 100).toFixed(2);

            return {
                tipo: tema.tipo,
                descripcion: tema.descripcion,
                promedioCalificaciones: promedioCalificaciones.toFixed(2),
                porcentajeInscripciones: `${porcentajeInscripciones}%`,
                indicePopularidad: ((promedioCalificaciones * 0.7) + (porcentajeInscripciones * 0.3)).toFixed(2)
            };
        });

        // Ordenar por índice de popularidad descendente
        popularidadTemas.sort((a, b) => b.indicePopularidad - a.indicePopularidad);

        res.json(popularidadTemas);
    } catch (error) {
        console.error("Error generando el reporte de popularidad:", error);
        res.status(500).json({ message: "Error generando el reporte de popularidad" });
    }
};