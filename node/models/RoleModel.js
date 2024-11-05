import db from "../database/db.js";
import { DataTypes } from "sequelize";

// Definición del modelo de rol
const RoleModel = db.define('roles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo: { type: DataTypes.STRING }
}, {
    timestamps: false
});

export default RoleModel;