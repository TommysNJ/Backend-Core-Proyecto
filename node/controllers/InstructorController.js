import InstructorModel from "../models/InstructorModel.js";

// Crear un instructor (solo administrador), no va a ser necesario
export const createInstructor = async (req, res) => {
    try {
        const { email, nombre, fecha_nacimiento, profesion, titulo_profesional } = req.body;
        await InstructorModel.create({ email, nombre, fecha_nacimiento, profesion, titulo_profesional });
        res.json({ message: "Instructor creado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ver todos los instructores (solo administrador)
export const getAllInstructors = async (req, res) => {
    try {
        const instructors = await InstructorModel.findAll();
        res.json(instructors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ver un instructor por su email (solo administrador e instructor)
export const getInstructorByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const instructor = await InstructorModel.findByPk(email);
        if (!instructor) {
            return res.status(404).json({ message: "Instructor no encontrado" });
        }
        res.json(instructor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Editar un instructor (solo administrador)
export const updateInstructor = async (req,

 res) => {
    try {
        const { email } = req.params;
        const { nombre, fecha_nacimiento, profesion, titulo_profesional } = req.body;
        await InstructorModel.update({ nombre, fecha_nacimiento, profesion, titulo_profesional }, { where: { email } });
        res.json({ message: "Instructor actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un instructor (solo administrador), no va a ser necesario
export const deleteInstructor = async (req, res) => {
    try {
        const { email } = req.params;
        await InstructorModel.destroy({ where: { email } });
        res.json({ message: "Instructor eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};