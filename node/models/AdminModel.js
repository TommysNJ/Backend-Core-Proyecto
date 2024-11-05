import db from "../database/db.js";
import { DataTypes } from "sequelize";

// Definición del modelo de administrador
const AdminModel = db.define('administradores', {
    email: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
            model: 'usuarios', // Tabla de referencia
            key: 'email'
        }
    },
    nombre: { type: DataTypes.STRING }
}, {
    timestamps: false
});

export default AdminModel;