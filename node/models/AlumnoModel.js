import db from "../database/db.js";
import { DataTypes } from "sequelize";

// Definición del modelo de alumno
const AlumnoModel = db.define('alumnos', {
    email: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
            model: 'usuarios', // Tabla de referencia
            key: 'email'
        }
    },
    nombre: { type: DataTypes.STRING },
    //fecha_nacimiento: { type: DataTypes.DATE },
    genero: { type: DataTypes.STRING },
    edad: { type: DataTypes.INTEGER },
    nivel_educacion: { type: DataTypes.STRING }
}, {
    timestamps: false
});

export default AlumnoModel;