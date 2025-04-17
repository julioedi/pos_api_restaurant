import sqlite3 from 'sqlite3';

// Usamos la base de datos de SQLite de forma asincrónica
export const db = new sqlite3.Database('./database.db');

// Función para realizar una consulta de tipo SELECT
export const runQuery = async (query: string, params: any[] = []): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Función para realizar una consulta de tipo INSERT, UPDATE, DELETE
export const runUpdate = async (query: string, params: any[] = []): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
};
