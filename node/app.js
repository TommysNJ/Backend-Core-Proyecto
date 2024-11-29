import express from "express";
import cors from 'cors';
import db from "./database/db.js";
import authRoutes from './routes/authRoutes.js';
import AlumnoModel from './models/AlumnoModel.js';
import InstructorModel from './models/InstructorModel.js';
import AdminModel from './models/AdminModel.js';
import CourseModel from './models/CourseModel.js';
import InscriptionModel from './models/InscriptionModel.js';
import TemaModel from './models/TemaModel.js';
import CalificacionModel from './models/CalificacionModel.js';
import ProgresoModel from './models/ProgresoModel.js';
import SubTemaModel from './models/SubTemaModel.js'; //añadido defensa

import temaRoutes from './routes/temaRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import instructorRoutes from './routes/instructorRoutes.js';
import alumnoRoutes from './routes/alumnoRoutes.js';
import inscripcionRoutes from './routes/inscripcionRoutes.js';
import calificacionRoutes from './routes/calificacionRoutes.js';
import progresoRoutes from './routes/progresoRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import subtemaRoutes from './routes/subtemaRoutes.js'; //añadido defensa

// Relacionar modelos en app.js
// Relación: Alumno - Inscripción (1-N)
AlumnoModel.hasMany(InscriptionModel, { foreignKey: 'email_alumno' });
InscriptionModel.belongsTo(AlumnoModel, { foreignKey: 'email_alumno', as: 'alumno'});

// Relación: Instructor - Curso (1-N)
InstructorModel.hasMany(CourseModel, { foreignKey: 'email_instructor', as: 'cursos' });
CourseModel.belongsTo(InstructorModel, { foreignKey: 'email_instructor', as: 'instructor' });

// Relación: Curso - Inscripción (1-N)
CourseModel.hasMany(InscriptionModel, { foreignKey: 'id_curso', as: 'inscripciones' });
InscriptionModel.belongsTo(CourseModel, { foreignKey: 'id_curso', as:'curso' });

// Relación: Tema - Curso (1-N)
TemaModel.hasMany(CourseModel, { foreignKey: 'id_tema', as: 'cursos' });
CourseModel.belongsTo(TemaModel, { foreignKey: 'id_tema', as: 'tema' });

// Relación: Subtemática - Curso (1-N)
SubTemaModel.hasMany(CourseModel, { foreignKey: 'id_subtematica', as: 'cursos' }); //añadido defensa
CourseModel.belongsTo(SubTemaModel, { foreignKey: 'id_subtematica', as: 'subtematica' }); //añadido defensa

// Relación: Tema - SubTemática (1-N)
TemaModel.hasMany(SubTemaModel, { foreignKey: 'id_tema', as: 'subtematicas' }); //añadido defensa
SubTemaModel.belongsTo(TemaModel, { foreignKey: 'id_tema', as: 'tema' }); //añadido defensa

// Relación: Inscripción - Calificación (1-1)
InscriptionModel.hasOne(CalificacionModel, { foreignKey: 'id_inscripcion', as:'calificaciones' });
CalificacionModel.belongsTo(InscriptionModel, { foreignKey: 'id_inscripcion', as:'inscripcion' });

// Relación: Inscripción - Progreso (1-N)
InscriptionModel.hasMany(ProgresoModel, { foreignKey: 'id_inscripcion' });
ProgresoModel.belongsTo(InscriptionModel, { foreignKey: 'id_inscripcion' });

const app = express();

//app.use(cors());
app.use(cors({
    origin: '*', // Permitir todas las solicitudes
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rutas para autenticación
app.use('/auth', authRoutes);
app.use('/alumnos', alumnoRoutes);
app.use('/instructores', instructorRoutes);
app.use('/temas', temaRoutes);
app.use('/cursos', courseRoutes);
app.use('/inscripciones', inscripcionRoutes);
app.use('/calificaciones', calificacionRoutes);  // Rutas de calificaciones separadas
app.use('/progresos', progresoRoutes);  
app.use('/reports', reportRoutes);
app.use('/subtematicas', subtemaRoutes); //añadido subtemas

try {
    await db.authenticate();
    console.log('Conexión exitosa con la base de datos');
} catch (error) {
    console.log(`El error de conexión es: ${error}`);
}

app.listen(8000, () => {
    console.log('Server UP running in http://localhost:8000/');
});

export default app;