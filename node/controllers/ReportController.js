import TemaModel from "../models/TemaModel.js";
import CourseModel from "../models/CourseModel.js";
import InscriptionModel from "../models/InscriptionModel.js";
import CalificacionModel from "../models/CalificacionModel.js";

export const getPopularidadTemas = async (req, res) => {
    try {
        // Obtener datos de todas las temáticas, cursos, inscripciones y calificaciones
        const temas = await TemaModel.findAll({
            include: [
                {
                    model: CourseModel,
                    as: "cursos",
                    include: [
                        {
                            model: InscriptionModel,
                            as: "inscripciones",
                            include: [
                                {
                                    model: CalificacionModel,
                                    as: "calificaciones",
                                    attributes: ["puntuacion"],
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        // Total general de estudiantes inscritos
        let totalEstudiantesGlobal = 0;
        temas.forEach((tema) => {
            tema.cursos.forEach((curso) => {
                totalEstudiantesGlobal += curso.inscripciones.length;
            });
        });

        // Procesar datos por temática
        const resultados = temas.map((tema) => {
            let totalEstudiantesTema = 0;
            let sumaCalificaciones = 0;
            let totalCalificaciones = 0;

            // Recorrer cursos de la temática
            tema.cursos.forEach((curso) => {
                totalEstudiantesTema += curso.inscripciones.length;

                curso.inscripciones.forEach((inscripcion) => {
                    const calificaciones = inscripcion.calificaciones || [];
                    calificaciones.forEach((calificacion) => {
                        sumaCalificaciones += parseFloat(calificacion.puntuacion || 0);
                        totalCalificaciones++;
                    });
                });
            });

            // Calcular promedio de calificaciones y porcentaje de estudiantes
            const promedioCalificacion =
                totalCalificaciones > 0
                    ? sumaCalificaciones / totalCalificaciones
                    : 0;

            const porcentajeEstudiantes =
                totalEstudiantesGlobal > 0
                    ? (totalEstudiantesTema / totalEstudiantesGlobal) * 100
                    : 0;

            // Combinar ambos factores en un índice de popularidad
            const popularidad =
                promedioCalificacion * 0.7 + porcentajeEstudiantes * 0.3;

            return {
                tipo: tema.tipo,
                descripcion: tema.descripcion,
                estudiantes: totalEstudiantesTema,
                promedioCalificacion: promedioCalificacion.toFixed(2),
                porcentajeEstudiantes: porcentajeEstudiantes.toFixed(2),
                indicePopularidad: popularidad.toFixed(2),
            };
        });

        // Ordenar por índice de popularidad descendente
        resultados.sort((a, b) => b.indicePopularidad - a.indicePopularidad);

        res.json(resultados);
    } catch (error) {
        console.error("Error generando el reporte de popularidad:", error);
        res.status(500).json({ message: "Error generando el reporte de popularidad" });
    }
};