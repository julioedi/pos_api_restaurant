import { Request, Response } from 'express';
import { runQuery } from '../config/db';
import { globalConstants } from '../utils/globalConstants';
import { processRow, processRows } from '../utils/processRow';
import { parseQueryParams } from '../utils/parseQueryParams';
import { tableName } from '../utils/tableName';

// Obtener todos los registros de una tabla

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const table = tableName(req);

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    // Total de registros
    const countResult = await runQuery(`SELECT COUNT(*) as total FROM \`${table}\``);
    const total = countResult?.[0]?.total ?? 0;

    // Registros paginados
    const query = `SELECT * FROM \`${table}\` ORDER BY ID DESC LIMIT ? OFFSET ?`;
    const results = await runQuery(query, [limit, offset]);

    const params = req.params as Record<string, any>;
    const queryParams = parseQueryParams(params);
    const processed = processRows(table, results, queryParams);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
      data: processed,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener registros', error });
  }
};

// Obtener un registro específico por ID
export const getById = async (req: Request, res: Response): Promise<void> => {
  let { id } = req.params;
  req.query
  const table = tableName(req);
  try {
    const result = await runQuery(`SELECT * FROM \`${table}\` WHERE id = ?`, [id]);
    if (result.length === 0) {
      res.status(404).json({ message: 'Registro no encontrado' });
    } else {
      res.json(processRow(table, result[0]));
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el registro', error });
  }
};

// Insertar un nuevo registro
export const insert = async (req: Request, res: Response): Promise<void> => {
  const table = tableName(req);
  const data = req.body;

  const columns = Object.keys(data).join(',');
  const placeholders = Object.keys(data).map(() => '?').join(',');
  const values = Object.values(data);

  try {
    const result = await runQuery(
      `INSERT INTO \`${table}\` (${columns}) VALUES (${placeholders})`,
      values
    );
    res.status(201).json({ id: result.lastID });
  } catch (error) {
    res.status(500).json({ message: 'Error al insertar el registro', error });
  }
};

// Actualizar un registro existente
export const update = async (req: Request, res: Response): Promise<void> => {
  let { id } = req.params;
  const table = tableName(req);
  const data = req.body;

  const updates = Object.keys(data)
    .map((key) => `\`${key}\` = ?`)
    .join(',');
  const values = Object.values(data);

  try {
    const result = await runQuery(
      `UPDATE \`${table}\` SET ${updates} WHERE id = ?`,
      [...values, id]
    );
    if (result.changes === 0) {
      res.status(404).json({ message: 'Registro no encontrado' });
    } else {
      res.json({ message: 'Registro actualizado correctamente' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el registro', error });
  }
};

// Eliminar un registro
export const remove = async (req: Request, res: Response): Promise<void> => {
  let { id } = req.params;
  const table = tableName(req);

  try {
    const result = await runQuery(`DELETE FROM \`${table}\` WHERE id = ?`, [id]);
    if (result.changes === 0) {
      res.status(404).json({ message: 'Registro no encontrado' });
    } else {
      res.json({ message: 'Registro eliminado correctamente' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el registro', error });
  }
};
