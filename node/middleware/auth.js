import jwt from 'jsonwebtoken';

// Middleware para verificar el token JWT
export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: "Token no proporcionado" });
    }

    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido" });
        }
        req.userEmail = decoded.email;
        req.userRole = decoded.role;
        next();
    });
};

// Middleware para verificar que el usuario tiene el rol adecuado
export const verifyRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userRole)) {
            return res.status(403).json({ message: "No tienes acceso a esta función" });
        }
        next();
    };
};