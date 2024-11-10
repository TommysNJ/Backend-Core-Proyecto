import TemaModel from "../models/TemaModel.js";
import CourseModel from "../models/CourseModel.js";

// Crear un tema (solo administrador)
export const createTema = async (req, res) => {
    try {
        const { tipo, descripcion } = req.body;
        await TemaModel.create({ tipo, descripcion });
        res.json({ message: "Tema creado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ver todos los temas (solo administrador)
/*export const getAllTemas = async (req, res) => {
    try {
        const temas = await TemaModel.findAll();
        res.json(temas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ver un tema por su ID (solo administrador)
export const getTemaById = async (req, res) => {
    try {
        const { id } = req.params;
        const tema = await TemaModel.findByPk(id);
        if (!tema) {
            return res.status(404).json({ message: "Tema no encontrado" });
        }
        res.json(tema);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};*/
export const getAllTemas = async (req, res) => {
    try {
        const temas = await TemaModel.findAll({
            include: [
                {
                    model: CourseModel,
                    as: 'cursos', // Utiliza el alias definido en la relación
                    attributes: ['id_curso', 'nombre', 'descripcion'], // Especifica los campos que deseas de CourseModel
                }
            ]
        });
        res.json(temas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ver un tema por su ID con sus cursos (solo administrador)
export const getTemaById = async (req, res) => {
    try {
        const { id } = req.params;
        const tema = await TemaModel.findByPk(id, {
            include: [
                {
                    model: CourseModel,
                    as: 'cursos', // Utiliza el alias definido en la relación
                    attributes: ['id_curso', 'nombre', 'descripcion'],
                }
            ]
        });
        if (!tema) {
            return res.status(404).json({ message: "Tema no encontrado" });
        }
        res.json(tema);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Editar un tema (solo administrador)
export const updateTema = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo, descripcion } = req.body;
        await TemaModel.update({ tipo, descripcion }, { where: { id_tema: id } });
        res.json({ message: "Tema actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un tema (solo administrador)
export const deleteTema = async (req, res) => {
    try {
        const { id } = req.params;
        await TemaModel.destroy({ where: { id_tema: id } });
        res.json({ message: "Tema eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};