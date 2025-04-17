import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../utils/auth'; // Aquí importas la función que valida el JWT

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Obtener el token

  if (!token) {
     res.status(401).json({ message: 'Acceso no autorizado: No hay token' });
     return
  }

  try {
    const decoded = verifyJWT(token); // Verificamos el JWT
    req.user = decoded; // Agregamos el usuario al objeto `req`
    next(); // Continuamos con la siguiente función del middleware
  } catch (error) {
    res.status(401).json({ message: 'Token inválido', error });
    return
  }
};
