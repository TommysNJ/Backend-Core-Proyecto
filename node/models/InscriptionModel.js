import db from "../database/db.js";
import { DataTypes } from "sequelize";

// Definición del modelo de inscripción
const InscriptionModel = db.define('inscripciones', {
    id_inscripcion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email_alumno: {
        type: DataTypes.STRING,
        references: {
            model: 'alumnos',
            key: 'email'
        }
    },
    id_curso: {
        type: DataTypes.INTEGER,
        references: {
            model: 'curso',
            key: 'id_curso'
        }
    },
    fecha_inscripcion: { type: DataTypes.DATE }
}, {
    timestamps: false
});

export default InscriptionModel;