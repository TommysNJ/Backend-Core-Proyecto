import db from "../database/db.js";
import { DataTypes } from "sequelize";

// Definición del modelo de instructor
const InstructorModel = db.define('instructores', {
    email: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
            model: 'usuarios', // Tabla de referencia
            key: 'email'
        }
    },
    nombre: { type: DataTypes.STRING },
    fecha_nacimiento: { type: DataTypes.DATE },
    profesion: { type: DataTypes.STRING },
    titulo_profesional: { type: DataTypes.STRING }
}, {
    timestamps: false
});

export default InstructorModel;