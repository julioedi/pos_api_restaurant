// src/config/defaultTables.ts

import { dbDefaults, dbOptionals } from './dbFields';
import { TableSchema } from '@/types/tableSchema';

const { date, longText, shortText, code_0, code_1, required, required_int } = dbOptionals;


export const defaultTables: Record<string, TableSchema> = {
  users: {
    cols: {
      ...dbDefaults,
      password: required,
      email:'TEXT NOT NULL',
      role: 'TEXT NOT NULL DEFAULT "[1]"', // Agregar campo de rol por defecto
    },
    json: ["role"],  // Ejemplo de columnas a serializar como JSON
    int: ["status"],             // Ejemplo de columnas que tienen valores numéricos
    fields_in_child: ["username", "role"],  // Campos que van a aparecer en una paginación
    unique: ["slug"],        // Asegurar que el 'username' sea único
  },

  products: {
    cols: {
      ...dbDefaults,
      price: required_int,         // El precio debe ser un número entero requerido
      category: shortText,         // La categoría es un campo de texto corto
      available: code_1,           // 'available' es 1 por defecto
    },
    json: ["category"],           // Convertir la categoría a JSON
    int: ["price", "available"],  // Campos de tipo numérico
    fields_in_child: ["title", "price", "category"],  // Campos a mostrar en la paginación
    unique: ["slug"],             // Campo 'slug' debe ser único
  },

  orders: {
    cols: {
      ...dbDefaults,
      table_number: shortText,    // Número de mesa como texto corto
      total: "REAL NOT NULL DEFAULT 0",  // Total en la orden, tipo 'REAL'
      status: "TEXT DEFAULT 'open'",     // Estado por defecto de la orden
    },
    json: ["status"],             // El estado de la orden se maneja como JSON
    int: ["total"],               // El total es un valor numérico
    fields_in_child: ["table_number", "total", "status"], // Campos visibles en la paginación
    unique: ["table_number"],     // Asegurar que el número de mesa sea único
  },
};
