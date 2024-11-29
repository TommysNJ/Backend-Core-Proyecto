/*import db from "../database/db.js";
import { DataTypes } from "sequelize";

// Definición del modelo de curso
const CourseModel = db.define('cursos', {
    id_curso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email_instructor: {
        type: DataTypes.STRING,
        references: {
            model: 'instructores',
            key: 'email'
        }
    },
    id_tema: {
        type: DataTypes.INTEGER,
        references: {
            model: 'tema',
            key: 'id_tema'
        }
    },
    nombre: { type: DataTypes.STRING },
    descripcion: { type: DataTypes.TEXT }
}, {
    timestamps: false
});

export default CourseModel;*/

//añadido defensa
import db from "../database/db.js";
import { DataTypes } from "sequelize";

// Definición del modelo de curso
const CourseModel = db.define('cursos', {
    id_curso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email_instructor: {
        type: DataTypes.STRING,
        references: {
            model: 'instructores',
            key: 'email'
        }
    },
    id_tema: {
        type: DataTypes.INTEGER,
        references: {
            model: 'tema',
            key: 'id_tema'
        }
    },
    id_subtematica: {
        type: DataTypes.INTEGER,
        references: {
            model: 'subtematica',
            key: 'id_subtematica'
        }
    },
    nombre: { type: DataTypes.STRING },
    descripcion: { type: DataTypes.TEXT }
}, {
    timestamps: false
});

export default CourseModel;