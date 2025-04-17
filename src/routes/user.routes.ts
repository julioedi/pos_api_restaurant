import { Router } from 'express';
import { register, login } from '../controllers/user.controller';

const router = Router();

// Ruta para registrar un nuevo usuario
router.post('/register', register);

// Ruta para hacer login y obtener el token
router.post('/login', login);

export default router;
