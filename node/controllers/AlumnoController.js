import AlumnoModel from "../models/AlumnoModel.js";

// Crear un alumno (solo administrador), no va a ser necesario
export const createAlumno = async (req, res) => {
    try {
        const { email, nombre/*, fecha_nacimiento*/, genero, edad, nivel_educacion } = req.body;
        await AlumnoModel.create({ email, nombre/*, fecha_nacimiento*/, genero, edad, nivel_educacion });
        res.json({ message: "Alumno creado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ver todos los alumnos (solo administrador)
export const getAllAlumnos = async (req, res) => {
    try {
        const alumnos = await AlumnoModel.findAll();
        res.json(alumnos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ver un alumno por su email (solo administrador y alumno)
export const getAlumnoByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const alumno = await AlumnoModel.findByPk(email);
        if (!alumno) {
            return res.status(404).json({ message: "Alumno no encontrado" });
        }
        res.json(alumno);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Editar un alumno (solo administrador)
export const updateAlumno = async (req, res) => {
    try {
        const { email } = req.params;
        const { nombre/*, fecha_nacimiento*/, genero, edad, nivel_educacion } = req.body;
        await AlumnoModel.update({ nombre/*, fecha_nacimiento*/, genero, edad, nivel_educacion }, { where: { email } });
        res.json({ message: "Alumno actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un alumno (solo administrador), no va a ser necesario
export const deleteAlumno = async (req, res) => {
    try {
        const { email } = req.params;
        await AlumnoModel.destroy({ where: { email } });
        res.json({ message: "Alumno eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};