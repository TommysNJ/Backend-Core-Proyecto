import db from "../database/db.js";
import { DataTypes } from "sequelize";

// Definición del modelo de SubTemática
const SubTemaModel = db.define('subtematicas', {
    id_subtematica: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    id_tema: {
        type: DataTypes.INTEGER,
        references: {
            model: 'temas', // Referencia a la tabla de Temas
            key: 'id_tema'
        }
    }
}, {
    timestamps: false
});

export default SubTemaModel;