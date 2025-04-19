// src/config/db.ts
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { TableSchema } from '@/types/tableSchema';

// Define baseData with the correct Database type
const baseData: {
  db: Database<sqlite3.Database, sqlite3.Statement> | undefined,
  inited: boolean,
  existTables:Array<string>,
  tablesData:Record<string, TableSchema>
} = {
  inited: false,
  db: undefined,
  existTables:[],
  tablesData:{}
};



export declare interface tableDefaultCols{
  ID?:number,
  title?:string,
  slug?:string,
  created_by?:number,
  updated_by?:number,
  status?:number,
  featured_id?:number,
}

export {baseData}




const checkDb = async () => {
  if (baseData.inited) {
    return;
  }
  baseData.db = await open({
    filename: './database.db',
    driver: sqlite3.Database,
  })
  baseData.inited = true;
}

export {checkDb}


export const runQuery = async (query: string, params: any[] = []): Promise<any> => {
  if (!baseData.db) {
    await checkDb();
  }
  return baseData.db?.all(query, params); // Usamos `database.all` para obtener los resultados
};

export const runUpdate = async (query: string, params: any[] = []): Promise<any> => {
  if (!baseData.db) {
    await checkDb();
  }
  return baseData.db?.run(query, params); // Usamos `database.run` para insertar/actualizar/eliminar
};
const {db} = baseData;
export default db;
