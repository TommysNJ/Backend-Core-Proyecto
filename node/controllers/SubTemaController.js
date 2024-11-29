import SubTemaModel from "../models/SubTemaModel.js";

// Crear una subtemática (solo administrador)
export const createSubTema = async (req, res) => {
    try {
        const { tipo, descripcion, id_tema } = req.body;
        const subtematica = await SubTemaModel.create({ tipo, descripcion, id_tema });
        res.json({ message: "Subtemática creada correctamente", subtematica });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ver todas las subtemáticas (solo administrador)
export const getAllSubTemas = async (req, res) => {
    try {
        const subtematicas = await SubTemaModel.findAll();
        res.json(subtematicas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ver una subtemática por su ID (solo administrador)
export const getSubTemaById = async (req, res) => {
    try {
        const { id } = req.params;
        const subtematica = await SubTemaModel.findByPk(id);
        if (!subtematica) {
            return res.status(404).json({ message: "Subtemática no encontrada" });
        }
        res.json(subtematica);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar una subtemática (solo administrador)
export const updateSubTema = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo, descripcion, id_tema } = req.body;
        await SubTemaModel.update({ tipo, descripcion, id_tema }, { where: { id_subtematica: id } });
        res.json({ message: "Subtemática actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar una subtemática (solo administrador)
export const deleteSubTema = async (req, res) => {
    try {
        const { id } = req.params;
        await SubTemaModel.destroy({ where: { id_subtematica: id } });
        res.json({ message: "Subtemática eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};