import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../utils/auth'; // Aquí importas la función que valida el JWT

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  next();
  return;
};
