import db from "../database/db.js";
import { DataTypes } from "sequelize";

// Definición del modelo de usuario
const UserModel = db.define('usuarios', {
    email: { 
        type: DataTypes.STRING, 
        primaryKey: true 
    },
    password: { 
        type: DataTypes.STRING 
    },
    role_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'roles', // Referencia a la tabla de roles
            key: 'id'
        }
    }
}, {
    timestamps: false
});

export default UserModel;