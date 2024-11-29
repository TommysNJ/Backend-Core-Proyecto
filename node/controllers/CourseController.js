import CourseModel from "../models/CourseModel.js";
import InstructorModel from "../models/InstructorModel.js";
import AlumnoModel from "../models/AlumnoModel.js";
import InscriptionModel from "../models/InscriptionModel.js";
import TemaModel from "../models/TemaModel.js";
import SubTemaModel from "../models/SubTemaModel.js"; // añadido defensa

// Crear un curso (solo administrador)
/*export const createCourse = async (req, res) => {
    try {
        const { nombre, descripcion, email_instructor, id_tema } = req.body;
        await CourseModel.create({ nombre, descripcion, email_instructor, id_tema });
        res.json({ message: "Curso creado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};*/
//añadido defensa
export const createCourse = async (req, res) => {
    try {
        const { nombre, descripcion, email_instructor, id_tema, id_subtematica } = req.body;
        await CourseModel.create({ nombre, descripcion, email_instructor, id_tema, id_subtematica });
        res.json({ message: "Curso creado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ver todos los cursos (solo administrador e instructor)
/*export const getAllCourses = async (req, res) => {
    try {
        const courses = await CourseModel.findAll();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};*/

export const getAllCourses = async (req, res) => {
    try {
        const courses = await CourseModel.findAll({
            include: [
                {
                    model: InstructorModel,
                    as: 'instructor',
                    attributes: ['nombre', 'email']
                },
                {
                    model: TemaModel,
                    as: 'tema',
                    attributes: ['tipo', 'descripcion']
                },
                //añadido defensa
                {
                    model: SubTemaModel,
                    as: 'subtematica', 
                    attributes: ['tipo', 'descripcion']
                }
            ]
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Ver un curso por su ID (solo administrador e instructor)
export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await CourseModel.findByPk(id);
        if (!course) {
            return res.status(404).json({ message: "Curso no encontrado" });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ver cursos de un instructor (instructor y administrador)
/*export const getInstructorCourses = async (req, res) => {
    try {
        const { email } = req.params;
        const courses = await CourseModel.findAll({ where: { email_instructor: email } });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};*/
export const getInstructorCourses = async (req, res) => {
    try {
        const { email } = req.params;
        const courses = await CourseModel.findAll({ 
            where: { email_instructor: email },
            include: [
                {
                    model: InstructorModel,
                    as: 'instructor',
                    attributes: ['nombre', 'email']
                },
                {
                    model: TemaModel,
                    as: 'tema',
                    attributes: ['tipo', 'descripcion']
                },
                // añadido defensa
                {
                    model: SubTemaModel,
                    as: 'subtematica', 
                    attributes: ['tipo', 'descripcion']
                }
            ]
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/*export const getInstructorCourses = async (req, res) => {
    try {
        const { email_instructor } = req.params;
        const courses = await CourseModel.findAll({ 
            where: { email_instructor},
            include: [
                {
                    model: TemaModel,
                    as: 'tema',
                    attributes: ['tipo', 'descripcion']
                }
            ]
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};*/

// Editar un curso (solo administrador)
/*export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, email_instructor, id_tema } = req.body;
        await CourseModel.update({ nombre, descripcion, email_instructor, id_tema }, { where: { id_curso: id } });
        res.json({ message: "Curso actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};*/
//añadido defensa
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, email_instructor, id_tema, id_subtematica } = req.body;
        await CourseModel.update(
            { nombre, descripcion, email_instructor, id_tema, id_subtematica },
            { where: { id_curso: id } }
        );
        res.json({ message: "Curso actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un curso (solo administrador)
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        await CourseModel.destroy({ where: { id_curso: id } });
        res.json({ message: "Curso eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ver alumnos inscritos en un curso (solo instructor)
export const getCourseStudents = async (req, res) => {
    try {
        const { id_curso } = req.params;
        const inscriptions = await InscriptionModel.findAll({
            where: { id_curso },
            include: [
                { 
                    model: AlumnoModel,
                    as: 'alumno'
                }
            ]
        });
        res.json(inscriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};