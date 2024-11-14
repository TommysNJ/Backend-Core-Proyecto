import CalificacionModel from "../models/CalificacionModel.js";
import InscriptionModel from "../models/InscriptionModel.js";
import AlumnoModel from "../models/AlumnoModel.js";
import CourseModel from "../models/CourseModel.js";
import { Op, fn, col } from "sequelize";

// Reporte: Comparación de Calificaciones por Género y Edad
export const getCalificacionesPorGeneroEdad = async (req, res) => {
    try {
        const { email_instructor, genero, edad_min, edad_max, id_curso } = req.query;
        
        // Condición para filtrar por curso específico o todos los cursos del instructor
        const cursoCondition = id_curso ? { id_curso } : { email_instructor };
        
        // Consultar el promedio de calificaciones por género y edad
        const calificaciones = await CalificacionModel.findAll({
            attributes: [
                [fn('AVG', col('puntuacion')), 'promedio_calificacion'],
                [col('alumno.genero'), 'genero']
            ],
            include: [
                {
                    model: InscriptionModel,
                    as: 'inscripcion',
                    include: [
                        {
                            model: AlumnoModel,
                            as: 'alumno',
                            where: {
                                ...(genero && { genero }),
                                ...(edad_min && edad_max && { edad: { [Op.between]: [edad_min, edad_max] } })
                            }
                        },
                        {
                            model: CourseModel,
                            as: 'curso',
                            where: cursoCondition
                        }
                    ]
                }
            ],
            group: ['alumno.genero'],
        });

        res.json(calificaciones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};