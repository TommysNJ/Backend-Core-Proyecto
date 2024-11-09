import UserModel from "../models/UserModel.js";
import AlumnoModel from "../models/AlumnoModel.js";
import InstructorModel from "../models/InstructorModel.js";
import AdminModel from "../models/AdminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Método para registrar un nuevo usuario (alumno, instructor)
export const registerUser = async (req, res) => {
    const { email, password, role_id, nombre, fecha_nacimiento, genero, edad, profesion, titulo_profesional, nivel_educacion } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await UserModel.create({ email, password: hashedPassword, role_id });

        if (role_id === 1) { // Rol de Alumno
            await AlumnoModel.create({ email, nombre/*, fecha_nacimiento*/, genero, edad, nivel_educacion });
        } else if (role_id === 2) { // Rol de Instructor
            await InstructorModel.create({ email, nombre, fecha_nacimiento, profesion, titulo_profesional });
        } else if (role_id === 3) {  // Rol de Administrador
            // Aquí insertas en la tabla 'administradores'
            await AdminModel.create({ email, nombre });
        }

        res.json({ message: "Registro creado correctamente" });
    } catch (error) {
        res.json({ message: error.message });
    }
};

// Método para iniciar sesión
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findByPk(email);
        if (user && await bcrypt.compare(password, user.password)) {
            let userInfo;
            let rolInfo;
            if (user.role_id === 1) { // Alumno
                userInfo = await AlumnoModel.findByPk(email);
                rolInfo = user.role_id;
            } else if (user.role_id === 2) { // Instructor
                userInfo = await InstructorModel.findByPk(email);
                rolInfo = user.role_id;
            } else if (user.role_id === 3) { // Administrador
                userInfo = await AdminModel.findByPk(email);
                rolInfo = user.role_id;
            }

            const token = jwt.sign({ email: user.email, role: user.role_id }, 'secret_key', { expiresIn: '1h' });
            res.json({ token, userInfo, rolInfo});
        } else {
            res.status(401).json({ message: "Credenciales inválidas" });
        }
    } catch (error) {
        res.json({ message: error.message });
    }
};

// Método para eliminar un usuario (solo puede ser accedido por administradores)
export const deleteUser = async (req, res) => {
    const { email } = req.params;  // Obtener el email del usuario que se quiere eliminar

    try {
        // Buscar el usuario en la tabla 'usuarios'
        const user = await UserModel.findByPk(email);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Eliminar al usuario de las tablas correspondientes según su rol
        if (user.role_id === 1) {  // Alumno
            await AlumnoModel.destroy({ where: { email } });
        } else if (user.role_id === 2) {  // Instructor
            await InstructorModel.destroy({ where: { email } });
        } else if (user.role_id === 3) {  // Administrador
            await AdminModel.destroy({ where: { email } });
        }

        // Eliminar de la tabla 'usuarios'
        await UserModel.destroy({ where: { email } });

        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};