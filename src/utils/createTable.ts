import { dbDefaults, dbOptionals, } from "../config/dbFields";
import { TableSchema } from "../types/tableSchema";
import { runQuery,baseData } from "../config/db";



const getExistingColumns = async (tableName: string): Promise<string[]> => {
  const query = `PRAGMA table_info(${tableName})`;  // SQLite query for table info (use DESCRIBE for MySQL)
  const result = await runQuery(query);
  return result.map((column: any) => column.name);  // Return only column names
}

const alterTableColumns = async (tableName: string, preData: TableSchema):Promise<number> =>{
  const data = preData.cols ?? {};
  const existingColumns = await getExistingColumns(tableName);
  for (const [col, typeKey] of Object.entries(data)) {
    if (existingColumns.includes(col)) continue; // Skip if column already exists

    const type = dbOptionals[typeKey] || 'TEXT';  // Default to TEXT if no match is found

    console.log(`Column '${col}' does not exist in table '${tableName}', adding it...`);
    
    const alterQuery = `ALTER TABLE ${tableName} ADD COLUMN ${col} ${type};`;
    try {
      await runQuery(alterQuery);  // Add the column to the table
    } catch (err) {
      console.error(`Error adding column '${col}' to table '${tableName}':`, err);
      return 2;  // Return failure
    }
  }
  
  return 1;  // Return success after ensuring columns are added
}


export async function createTable(tableName: string, preData: TableSchema): Promise<number> {
  const custom = preData.custom === true;
  const data = preData.cols ?? {};
  // if (baseData.existTables.includes(tableName)) {
  //   return await alterTableColumns(tableName,preData);s
  // }
  
  const checkConstraints: string[] = [];
  let sql = `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;

  // Add default columns or primary key if not custom
  if (!custom) {
    for (const [key, type] of Object.entries(dbDefaults)) {
      sql += `  ${key} ${type},\n`;
    }
  } else {
    sql += `  ID INTEGER PRIMARY KEY AUTOINCREMENT,\n`;  // Custom tables get their own primary key
  }

  // Add custom columns
  for (const [col, typeKey] of Object.entries(data)) {
    if (!custom && dbDefaults[col]) continue;  // Skip default columns if not custom
    
    // Get the SQL type for the column
    const type = dbOptionals[typeKey] || 'TEXT';  // Default to TEXT if no match is found
    sql += `  ${col} ${type},\n`;

    // Add constraints for required fields
    if (typeKey === 'required') {
      checkConstraints.push(`${col} != ''`);
    } else if (typeKey === 'required_int') {
      checkConstraints.push(`${col} != 0`);
    }
  }

  // Add UNIQUE constraints (if any)
  if (preData.unique && preData.unique.length) {
    sql += `  UNIQUE (${preData.unique.join(', ')}),\n`;
  }

  // Add CHECK constraints (e.g., non-empty fields for required ones)
  if (checkConstraints.length > 0) {
    sql += `  CHECK (${checkConstraints.join(" AND ")}),\n`;
  }

  // Clean up the final SQL statement (remove last comma)
  sql = sql.trim().replace(/,$/, '');
  sql += '\n);';

  try {
    await runQuery(sql);  // Execute the SQL query
    return 1;  // Return success
  } catch (err) {
    console.log({sql})
    console.error(`Error creating table '${tableName}':`, err);
    return 2;  // Return failure
  }
}
