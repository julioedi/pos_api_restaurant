// src/types/tableSchema.ts

export interface TableSchema {
  cols: { [key: string]: string };
  json?: string[];
  int?: string[];
  fields_in_child?: string[];
  unique?: string[];
  custom?: boolean;
}
