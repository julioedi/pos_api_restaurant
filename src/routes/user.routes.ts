import { Router } from 'express';
import { register, login } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { getAll, getById } from '../controllers/dynamic.controller';

const router = Router();

// Ruta para registrar un nuevo usuario
router.post('/register', register);
router.get('/register', register);

// Ruta para hacer login y obtener el token
router.post('/login', login);
router.get('/login', login);

// Ruta para registrar un nuevo usuario
router.get('/', authMiddleware, getAll);

// Ruta para registrar un nuevo usuario
router.all('/:id', authMiddleware, getById);

export default router;
