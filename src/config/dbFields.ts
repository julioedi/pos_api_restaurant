// src/config/dbFields.ts


export const dbOptionals: Record<string, string> = {
    date: "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP",
    longText: "TEXT NOT NULL DEFAULT ''",
    shortText: "VARCHAR(20) NOT NULL DEFAULT ''",
    code_0: "INTEGER NOT NULL DEFAULT 0",
    code_1: "INTEGER NOT NULL DEFAULT 1",
    required: "TEXT NOT NULL",
    required_int: "INTEGER NOT NULL",
  };
  
  export const dbDefaults: Record<string, string> = {
    ID: "INTEGER PRIMARY KEY AUTOINCREMENT",
    title: "TEXT NOT NULL",
    slug: "VARCHAR(200) NOT NULL",
    created: "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP",
    created_by: "INTEGER NOT NULL DEFAULT 0",
    updated: "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP",
    updated_by: "INTEGER NOT NULL DEFAULT 0",
    status: "INTEGER NOT NULL DEFAULT 1",
    featured_id: "INTEGER NOT NULL DEFAULT 0",
  };
  