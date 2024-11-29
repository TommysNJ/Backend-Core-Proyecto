import { Op } from "sequelize"; 
import TemaModel from "../models/TemaModel.js";
import CourseModel from "../models/CourseModel.js";
import InscriptionModel from "../models/InscriptionModel.js";
import CalificacionModel from "../models/CalificacionModel.js";
import AlumnoModel from "../models/AlumnoModel.js"; 
import InstructorModel from "../models/InstructorModel.js";
import SubTemaModel from "../models/SubTemaModel.js";

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

        // Cálculo del total de inscripciones globales
        const totalInscripcionesGlobal = Object.values(temaData).reduce(
            (sum, tema) => sum + tema.totalInscripciones,
            0
        );

        const totalIndices = [];

        const reporteSinNormalizar = Object.values(temaData).map(tema => {
            const promedioCalificaciones =
                tema.totalCalificaciones > 0
                    ? (tema.sumaPuntuaciones / tema.totalCalificaciones).toFixed(2)
                    : 0;

            const porcentajeInscripciones =
                (tema.totalInscripciones / totalInscripcionesGlobal) * 100;

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

// Método para calcular el porcentaje total de inscripciones por temática
export const getPorcentajeInscripcionesPorTematica = async (req, res) => {
    try {
        // Obtener todas las inscripciones con sus cursos y temáticas
        const inscripciones = await InscriptionModel.findAll({
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
        });

        // Calcular el total de inscripciones
        const totalInscripcionesGlobal = inscripciones.length;

        // Agrupar inscripciones por temática
        const temaData = {};

        for (const inscripcion of inscripciones) {
            const tema = inscripcion.curso.tema;
            const temaKey = tema.id_tema;

            if (!temaData[temaKey]) {
                temaData[temaKey] = {
                    tipo: tema.tipo,
                    descripcion: tema.descripcion,
                    totalInscripciones: 0
                };
            }

            temaData[temaKey].totalInscripciones += 1;
        }

        // Generar el reporte con porcentajes
        const reporte = Object.values(temaData).map(tema => {
            const porcentajeInscripciones =
                (tema.totalInscripciones / totalInscripcionesGlobal) * 100;

            return {
                tipo: tema.tipo,
                descripcion: tema.descripcion,
                totalInscripciones: tema.totalInscripciones,
                porcentajeInscripciones: `${porcentajeInscripciones.toFixed(2)}%`
            };
        });

        // Ordenar por porcentaje de inscripciones en orden descendente
        const reporteOrdenado = reporte.sort(
            (a, b) =>
                parseFloat(b.porcentajeInscripciones.replace('%', '')) -
                parseFloat(a.porcentajeInscripciones.replace('%', ''))
        );

        res.json(reporteOrdenado);
    } catch (error) {
        console.error("Error generando el reporte de inscripciones por temática:", error);
        res.status(500).json({ message: "Error generando el reporte de inscripciones por temática" });
    }
};

export const getPopularidadTemasConFiltros = async (req, res) => {
    try {
        const { genero, rangoEdadInicio, rangoEdadFin } = req.query;

        // Configuración de filtros condicionales
        const whereAlumno = {};
        if (genero) whereAlumno.genero = genero;
        if (rangoEdadInicio && rangoEdadFin) {
            whereAlumno.edad = { [Op.between]: [parseInt(rangoEdadInicio), parseInt(rangoEdadFin)] };
        }

        // Consulta de calificaciones con relaciones
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
                        },
                        {
                            model: AlumnoModel,
                            as: 'alumno',
                            where: whereAlumno // Aplicamos los filtros aquí
                        }
                    ]
                }
            ]
        });

        const temaData = {};

        for (const calificacion of calificaciones) {
            const tema = calificacion?.inscripcion?.curso?.tema;
            if (!tema) continue; // Evitar errores si los datos son nulos
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

        const reporteSinNormalizar = Object.values(temaData).map(tema => {
            const promedioCalificaciones =
                tema.totalCalificaciones > 0
                    ? (tema.sumaPuntuaciones / tema.totalCalificaciones).toFixed(2)
                    : 0;

            const porcentajeInscripciones =
                (tema.totalInscripciones / totalInscripcionesGlobal) * 100;

            return {
                tipo: tema.tipo,
                descripcion: tema.descripcion,
                promedioCalificaciones,
                porcentajeInscripciones: `${porcentajeInscripciones.toFixed(2)}%`
            };
        });

        const totalIndices = reporteSinNormalizar.map(
            tema => (parseFloat(tema.promedioCalificaciones) / 10) * parseFloat(tema.porcentajeInscripciones)
        );

        const sumaTotalIndices = totalIndices.reduce((sum, indice) => sum + indice, 0);

        const reporteNormalizado = reporteSinNormalizar.map(tema => {
            const indicePopularidadBruto =
                (parseFloat(tema.promedioCalificaciones) / 10) * parseFloat(tema.porcentajeInscripciones);
            const indicePopularidad = (indicePopularidadBruto / sumaTotalIndices) * 100;

            return {
                ...tema,
                indicePopularidad: `${indicePopularidad.toFixed(2)}%`
            };
        });

        const reporteOrdenado = reporteNormalizado.sort(
            (a, b) =>
                parseFloat(b.indicePopularidad.replace('%', '')) -
                parseFloat(a.indicePopularidad.replace('%', ''))
        );

        res.json(reporteOrdenado);
    } catch (error) {
        console.error("Error generando el reporte con filtros:", error);
        res.status(500).json({ message: "Error generando el reporte con filtros" });
    }
};

 // añadido defensa
export const getPopularidadSubtematicasPorInstructor = async (req, res) => {
    try {
        const { email_instructor } = req.query;

        if (!email_instructor) {
            return res.status(400).json({ message: "El email del instructor es requerido" });
        }

        // Consultar todas las calificaciones relacionadas con las subtemáticas impartidas por el instructor
        const calificaciones = await CalificacionModel.findAll({
            include: [
                {
                    model: InscriptionModel,
                    as: "inscripcion",
                    include: [
                        {
                            model: CourseModel,
                            as: "curso",
                            where: { email_instructor },
                            include: [
                                {
                                    model: SubTemaModel,
                                    as: "subtematica"
                                },
                                {
                                    model: InstructorModel,
                                    as: "instructor",
                                    attributes: ["nombre", "email"]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        // Agrupar datos por subtemática
        const subtematicaData = {};

        for (const calificacion of calificaciones) {
            const subtematica = calificacion?.inscripcion?.curso?.subtematica;
            if (!subtematica) continue; // Evitar errores si los datos son nulos

            const subtematicaKey = subtematica.id_subtematica;

            if (!subtematicaData[subtematicaKey]) {
                subtematicaData[subtematicaKey] = {
                    tipo: subtematica.tipo,
                    descripcion: subtematica.descripcion,
                    totalCalificaciones: 0,
                    sumaPuntuaciones: 0,
                    totalInscripciones: 0
                };
            }

            const subtematicaEntry = subtematicaData[subtematicaKey];

            // Incrementar conteos
            subtematicaEntry.totalInscripciones += 1;

            if (calificacion.puntuacion !== null) {
                subtematicaEntry.totalCalificaciones += 1;
                subtematicaEntry.sumaPuntuaciones += parseFloat(calificacion.puntuacion);
            }
        }

        // Calcular inscripciones globales para normalizar datos
        const totalInscripcionesGlobal = Object.values(subtematicaData).reduce(
            (sum, subtematica) => sum + subtematica.totalInscripciones,
            0
        );

        const totalIndices = [];

        // Crear reporte sin normalizar
        const reporteSinNormalizar = Object.values(subtematicaData).map(subtematica => {
            const promedioCalificaciones =
                subtematica.totalCalificaciones > 0
                    ? (subtematica.sumaPuntuaciones / subtematica.totalCalificaciones).toFixed(2)
                    : 0;

            const porcentajeInscripciones =
                (subtematica.totalInscripciones / totalInscripcionesGlobal) * 100;

            const indicePopularidadBruto =
                (parseFloat(promedioCalificaciones) / 10) * porcentajeInscripciones;

            totalIndices.push(indicePopularidadBruto);

            return {
                tipo: subtematica.tipo,
                descripcion: subtematica.descripcion,
                promedioCalificaciones,
                porcentajeInscripciones: `${porcentajeInscripciones.toFixed(2)}%`,
                indicePopularidadBruto: indicePopularidadBruto || 0
            };
        });

        // Normalizar los índices
        const sumaTotalIndices = totalIndices.reduce((sum, indice) => sum + indice, 0);

        const reporteNormalizado = reporteSinNormalizar.map(subtematica => {
            const indiceNormalizado =
                (subtematica.indicePopularidadBruto / sumaTotalIndices) * 100;

            return {
                tipo: subtematica.tipo,
                descripcion: subtematica.descripcion,
                promedioCalificaciones: subtematica.promedioCalificaciones,
                porcentajeInscripciones: subtematica.porcentajeInscripciones,
                indicePopularidad: `${indiceNormalizado.toFixed(2)}%`
            };
        });

        // Ordenar reporte por índice de popularidad
        const reporteOrdenado = reporteNormalizado.sort(
            (a, b) =>
                parseFloat(b.indicePopularidad.replace("%", "")) -
                parseFloat(a.indicePopularidad.replace("%", ""))
        );

        res.json(reporteOrdenado);
    } catch (error) {
        console.error("Error generando el reporte de subtemáticas por instructor:", error);
        res.status(500).json({ message: "Error generando el reporte de subtemáticas por instructor" });
    }
};