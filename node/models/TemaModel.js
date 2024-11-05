import db from "../database/db.js";
import { DataTypes } from "sequelize";

// Definición del modelo de tema
const TemaModel = db.define('temas', {
    id_tema: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo: { type: DataTypes.STRING },
    descripcion: { type: DataTypes.TEXT }
}, {
    timestamps: false
});

export default TemaModel;