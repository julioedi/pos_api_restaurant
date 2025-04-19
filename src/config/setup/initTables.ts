// src/setup/initTables.ts

import { createTable } from "../../utils/createTable";
import { defaultTables } from "../../config/defaultTables";
import { TableSchema } from '../../types/tableSchema';

/**
 * Inicializa todas las tablas por defecto
 */
const initTables = async() => {
  for (const [tableName, schema] of Object.entries(defaultTables)) {
    const result = await createTable(tableName, schema as TableSchema);

    if (result === 1) {
      console.log(`🟢 Tabla '${tableName}' creada correctamente.`);
    } else if (result === 0) {
      console.log(`🟡 Tabla '${tableName}' ya existe.`);
    } else {
      console.error(`🔴 Error al crear la tabla '${tableName}'.`);
    }
  }
}

export default initTables;
export {initTables}
