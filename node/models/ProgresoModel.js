import db from "../database/db.js";
import { DataTypes } from "sequelize";

// Definición del modelo de progreso
const ProgresoModel = db.define('progresos', {
    id_detalle: {
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
    fecha_actualizacion: { type: DataTypes.DATE },
    descripcion: { type: DataTypes.TEXT }
}, {
    timestamps: false
});

export default ProgresoModel;