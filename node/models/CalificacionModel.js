import db from "../database/db.js";
import { DataTypes } from "sequelize";

// Definición del modelo de calificación
const CalificacionModel = db.define('calificaciones', {
    id_calificacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_inscripcion: {
        type: DataTypes.INTEGER,
        references: {
            model: 'inscripciones',
            key: 'id_inscripcion'
        }
    },
    puntuacion: { type: DataTypes.DECIMAL(5, 2) },
    descripcion: { type: DataTypes.TEXT }
}, {
    timestamps: false
});

export default CalificacionModel;