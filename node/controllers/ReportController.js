import TemaModel from "../models/TemaModel.js";
import CourseModel from "../models/CourseModel.js";
import InscriptionModel from "../models/InscriptionModel.js";
import CalificacionModel from "../models/CalificacionModel.js";

export const getReportePopularidadTemas = async (req, res) => {
    try {
        // Obtener todas las calificaciones con las relaciones necesarias
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
                    totalAlumnos: 0
                };
            }

            const temaEntry = temaData[temaKey];

            // Contar inscripciones por tema
            temaEntry.totalAlumnos += 1;

            // Sumar calificaciones solo si existen
            if (calificacion.puntuacion !== null) {
                temaEntry.totalCalificaciones += 1;
                temaEntry.sumaPuntuaciones += parseFloat(calificacion.puntuacion);
            }
        }

        const totalAlumnosGlobal = Object.values(temaData).reduce(
            (sum, tema) => sum + tema.totalAlumnos,
            0
        );

        const totalIndices = [];

        const reporteSinNormalizar = Object.values(temaData).map(tema => {
            const promedioCalificaciones =
                tema.totalCalificaciones > 0
                    ? (tema.sumaPuntuaciones / tema.totalCalificaciones).toFixed(2)
                    : 0;

            const porcentajeInscripciones =
                (tema.totalAlumnos / totalAlumnosGlobal) * 100;

            const indicePopularidadBruto =
                (parseFloat(promedioCalificaciones) / 10) * // Calificación máxima es 10
                porcentajeInscripciones;

            totalIndices.push(indicePopularidadBruto);

            return {
                tipo: tema.tipo,
                descripcion: tema.descripcion,
                promedioCalificaciones,
                porcentajeInscripciones: `${porcentajeInscripciones.toFixed(2)}%`,
                indicePopularidadBruto: indicePopularidadBruto || 0 // Evitar NaN
            };
        });

        const sumaTotalIndices = totalIndices.reduce((sum, indice) => sum + indice, 0);

        const reporteNormalizado = reporteSinNormalizar.map(tema => {
            const indiceNormalizado =
                (tema.indicePopularidadBruto / sumaTotalIndices) * 100;

            return {
                tipo: tema.tipo,
                descripcion: tema.descripcion,
                promedioCalificaciones: tema.promedioCalificaciones,
                porcentajeInscripciones: tema.porcentajeInscripciones,
                indicePopularidad: `${indiceNormalizado.toFixed(2)}%`
            };
        });

        // Ordenar en orden descendente por índice de popularidad
        const reporteOrdenado = reporteNormalizado.sort(
            (a, b) =>
                parseFloat(b.indicePopularidad.replace('%', '')) -
                parseFloat(a.indicePopularidad.replace('%', ''))
        );

        res.json(reporteOrdenado);
    } catch (error) {
        console.error("Error generando el reporte de popularidad:", error);
        res.status(500).json({ message: "Error generando el reporte de popularidad" });
    }
};