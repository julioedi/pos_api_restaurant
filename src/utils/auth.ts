import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Secreto para firmar el JWT (puedes guardarlo en un archivo .env)
const JWT_SECRET = process.env?.JWT_SECRET ?? 'mi_secreto_jwt'; // Cambia esto por un valor más seguro
const timer =  (process.env?.TOKEN_TIME ?? 30).toString();
const TOKEN_TIME = !Number.isNaN(timer) ? Number.parseInt(timer) : 30;

// Función para generar un JWT
export const generateJWT = (userId: number): string => {
  return jwt.sign({ ID: userId }, JWT_SECRET, { expiresIn: TOKEN_TIME * 86400 }); // (num of days) * (total days)
};  

// Función para verificar un JWT
export const verifyJWT = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido');
  }
};

// Función para hashear contraseñas
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Función para comparar contraseñas
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
