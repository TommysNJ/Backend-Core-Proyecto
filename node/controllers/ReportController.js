import TemaModel from "../models/TemaModel.js";
import CourseModel from "../models/CourseModel.js";
import InscriptionModel from "../models/InscriptionModel.js";
import CalificacionModel from "../models/CalificacionModel.js";

export const getPopularidadTemas = async (req, res) => {
    try {
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

        const temaData = {};

        for (const calificacion of calificaciones) {
            const tema = calificacion.inscripcion.curso.tema;
            const temaKey = tema.id_tema;

            if (!temaData[temaKey]) {
                temaData[temaKey] = {
                    tipo: tema.tipo,
                    descripcion: tema.descripcion,
                    totalCalificaciones: 0,
                    sumaPuntuaciones: 0,
                    totalInscripciones: 0
                };
            }

            const temaEntry = temaData[temaKey];

            // Agregar datos de inscripciones y calificaciones
            temaEntry.totalInscripciones += 1;

            if (calificacion.puntuacion !== null) {
                temaEntry.totalCalificaciones += 1;
                temaEntry.sumaPuntuaciones += parseFloat(calificacion.puntuacion);
            }
        }

        const totalInscripcionesGlobal = Object.values(temaData).reduce(
            (sum, tema) => sum + tema.totalInscripciones,
            0
        );

        const reporte = Object.values(temaData).map(tema => {
            const promedioCalificaciones =
                tema.totalCalificaciones > 0
                    ? (tema.sumaPuntuaciones / tema.totalCalificaciones).toFixed(2)
                    : 0;

            const porcentajeInscripciones = (
                (tema.totalInscripciones / totalInscripcionesGlobal) *
                100
            ).toFixed(2);

            const indicePopularidad = (
                (parseFloat(promedioCalificaciones) / 10) * // Calificación máxima es 10
                parseFloat(porcentajeInscripciones)
            ).toFixed(2);

            return {
                tipo: tema.tipo,
                descripcion: tema.descripcion,
                promedioCalificaciones,
                porcentajeInscripciones: `${porcentajeInscripciones}%`,
                indicePopularidad: isNaN(indicePopularidad) ? "0.00" : indicePopularidad
            };
        });

        // Ordenar en orden descendente por índice de popularidad
        const reporteOrdenado = reporte.sort(
            (a, b) => parseFloat(b.indicePopularidad) - parseFloat(a.indicePopularidad)
        );

        res.json(reporteOrdenado);
    } catch (error) {
        console.error("Error generando el reporte de popularidad:", error);
        res.status(500).json({ message: "Error generando el reporte de popularidad" });
    }
};