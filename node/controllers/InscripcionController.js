import InscriptionModel from "../models/InscriptionModel.js";
import moment from 'moment-timezone';
import CourseModel from '../models/CourseModel.js'; // Importar el modelo de cursos
import InstructorModel from '../models/InstructorModel.js'; // Importar el modelo de instructores

// Inscribirse a un curso (solo alumno)
export const createInscripcion = async (req, res) => {
    try {
        const { email_alumno, id_curso } = req.body;

        // Verifica si ya está inscrito
        const inscripcionExistente = await InscriptionModel.findOne({ where: { email_alumno, id_curso } });
        if (inscripcionExistente) {
            return res.status(400).json({ message: "Ya estás inscrito en este curso" });
        }

        // Obtener la fecha actual con la zona horaria correcta
        const fecha_inscripcion = moment().tz("America/Guayaquil").format('YYYY-MM-DD');

        await InscriptionModel.create({
            email_alumno,
            id_curso,
            fecha_inscripcion // Fecha actual de inscripción
        });

        res.json({ message: "Inscripción realizada correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ver todas las inscripciones de un alumno (solo alumno)
/*export const getInscripcionesAlumno = async (req, res) => {
    try {
        const { email_alumno } = req.params;
        const inscripciones = await InscriptionModel.findAll({ where: { email_alumno } });
        res.json(inscripciones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};*/

// Ver todas las inscripciones de un alumno (solo alumno)
export const getInscripcionesAlumno = async (req, res) => {
    try {
        const { email_alumno } = req.params;
        const inscripciones = await InscriptionModel.findAll({
            where: { email_alumno },
            include: [
                {
                    model: CourseModel,
                    as: 'curso', // Este alias debe coincidir con el definido en las asociaciones
                    include: [
                        {
                            model: InstructorModel,
                            as: 'instructores', // Este alias debe coincidir con el definido en las asociaciones
                            attributes: ['nombre', 'email', 'profesion'], // Incluye solo los atributos necesarios
                        },
                    ],
                    attributes: ['nombre', 'descripcion', 'id_curso'], // Incluye solo los atributos necesarios
                },
            ],
        });
        res.json(inscripciones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};