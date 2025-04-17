import { Request, Response } from 'express';
import { hashPassword, comparePassword, generateJWT } from '../utils/auth';
import { runQuery } from '../config/db';

// Tipado para el cuerpo de la solicitud de registro
interface RegisterRequestBody {
  username: string;
  password: string;
}

// Registro de usuario
export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Faltan datos' });
    return;
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await runQuery(`SELECT * FROM users WHERE username = ?`, [username]);
    if (existingUser.length > 0) {
      res.status(400).json({ message: 'Usuario ya existe' });
      return;
    }

    // Hashear la contraseña
    const hashedPassword = await hashPassword(password);

    // Insertar el nuevo usuario en la base de datos
    const result = await runQuery(
      `INSERT INTO users (username, password) VALUES (?, ?)`,
      [username, hashedPassword]
    );

    res.status(201).json({ id: result.lastID, username });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error });
  }
};

// Tipado para el cuerpo de la solicitud de login
interface LoginRequestBody {
  username: string;
  password: string;
}

// Login de usuario
export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Faltan datos' });
    return;
  }

  try {
    // Buscar el usuario en la base de datos
    const user = await runQuery(`SELECT * FROM users WHERE username = ?`, [username]);
    if (user.length === 0) {
      res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
      return;
    }

    // Comparar contraseñas
    const isMatch = await comparePassword(password, user[0].password);
    if (!isMatch) {
      res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
      return;
    }

    // Generar JWT
    const token = generateJWT(user[0].id);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};
