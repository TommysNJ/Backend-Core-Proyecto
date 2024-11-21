import TemaModel from "../models/TemaModel.js";
import CourseModel from "../models/CourseModel.js";
import InscriptionModel from "../models/InscriptionModel.js";
import CalificacionModel from "../models/CalificacionModel.js";

export const getPopularidadTemas = async (req, res) => {
    try {
        // Obtener los temas junto con las inscripciones y calificaciones
        const temas = await TemaModel.findAll({
            include: [
                {
                    model: CourseModel,
                    as: 'cursos',
                    attributes: ['id_curso'],
                    include: [
                        {
                            model: InscriptionModel,
                            as: 'inscripciones',
                            attributes: ['id_inscripcion'],
                            include: [
                                {
                                    model: CalificacionModel,
                                    as: 'calificaciones',
                                    attributes: ['puntuacion']
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        // Calcular el total de inscripciones
        const totalInscripciones = temas.reduce((total, tema) => {
            const inscripcionesTema = tema.cursos.reduce((cursoTotal, curso) => {
                return cursoTotal + curso.inscripciones.length;
            }, 0);
            return total + inscripcionesTema;
        }, 0);

        // Calcular la popularidad de cada tema
        const popularidadTemas = temas.map((tema) => {
            const totalInscripcionesTema = tema.cursos.reduce((cursoTotal, curso) => {
                return cursoTotal + curso.inscripciones.length;
            }, 0);

            // Calcular el promedio de calificaciones solo para inscripciones con calificaciones
            const totalPromedios = tema.cursos.reduce((sumaPromedios, curso) => {
                const totalCalificaciones = curso.inscripciones.reduce((suma, inscripcion) => {
                    const calificaciones = inscripcion.calificaciones.filter((c) => c.puntuacion !== null);
                    return suma + calificaciones.reduce((sum, c) => sum + c.puntuacion, 0);
                }, 0);

                const totalInscripcionesConCalificacion = curso.inscripciones.reduce((count, inscripcion) => {
                    return count + inscripcion.calificaciones.filter((c) => c.puntuacion !== null).length;
                }, 0);

                const promedioCurso = totalInscripcionesConCalificacion > 0
                    ? totalCalificaciones / totalInscripcionesConCalificacion
                    : 0;

                return sumaPromedios + promedioCurso;
            }, 0);

            const promedioCalificaciones = totalPromedios / (tema.cursos.length || 1);

            const porcentajeInscripciones = ((totalInscripcionesTema / (totalInscripciones || 1)) * 100).toFixed(2);

            const indicePopularidad = (promedioCalificaciones * 0.7) + (porcentajeInscripciones * 0.3);

            return {
                tema: tema.tipo,
                descripcion: tema.descripcion,
                promedioCalificaciones: promedioCalificaciones.toFixed(2),
                porcentajeInscripciones,
                indicePopularidad: indicePopularidad.toFixed(2)
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