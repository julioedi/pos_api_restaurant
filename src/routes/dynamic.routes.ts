import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { getAll, getById, insert, update, remove } from '../controllers/dynamic.controller';

const router = Router();

// Ruta protegida para obtener todos los registros de una tabla
router.get('/:table', authMiddleware, getAll);

// Ruta protegida para obtener un registro por su ID
router.get('/:table/:id', authMiddleware, getById);

// Ruta protegida para insertar un nuevo registro
router.post('/:table', authMiddleware, insert);

// Ruta protegida para actualizar un registro existente
router.put('/:table/:id', authMiddleware, update);

// Ruta protegida para eliminar un registro por su ID
router.delete('/:table/:id', authMiddleware, remove);

export default router;
