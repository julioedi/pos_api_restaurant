import { defaultTables } from "../config";

declare type Row = Record<string, any>;
declare type RowList = Array<Row>

declare interface RowExtras{
  json?:string[],
  process_json_tables?:boolean,
  fields_in?:string[]|string,
  exclude?:string[]|string
}

export function processRows(table: string, rows: RowList,extras:RowExtras = {}): RowList {
  const processed: RowList = rows.map(item =>{
    return processRow(table,item,extras)
  });
  return processed;
}

export function processRow(table: string, row: Row,extras:RowExtras = {} ): Row {
  const schema = defaultTables[table];

  if (!schema) return row;
  
  const processed: Row = {};

  //make an array for include columns keys
  let include_fields = extras.fields_in ?? [];
  if (typeof include_fields == "string") {
    include_fields = include_fields.split(",");
  }
  

  //make an array for extra data
  let exclude = extras.exclude ?? [];
  if (typeof exclude == "string") {
    include_fields = exclude.split(",");
  }
  
  console.log({include_fields,exclude});

  const preData = Object.keys(row);
  for (let i = 0; i < preData.length; i++) {
    const key = preData[i];
    //prevents to show any column with password
    if (key.match(/password/i)) {
      continue;
    }

    let value = row[key];
    
    if (schema.json?.includes(key)) {
      if (typeof value === 'string') {
        try {
          value = JSON.parse(value);
        } catch {
          value = null;
        }
      }
    }

    // 🔢 Si es tipo int, lo convertimos a número
    if (schema.int?.includes(key)) {
      value = parseInt(value, 10);
      if (isNaN(value)) value = 0;
    }
    processed[key] = value;
    
  }
  const preRow:Row = {};

  //try to include fields
  let fields_in_row = 0;
  if (include_fields.length > 0) {
    for (let i = 0; i < include_fields.length; i++) {
      const key = include_fields[i];
      
      //if field exists will aded to final row
      if (processed[key]) {
        preRow[key] = processed[key];
        fields_in_row++;
      }
    }
  }

  if (fields_in_row === 0) {
    Object.assign(preRow,processed);

    if (exclude.length > 0) {
      console.log(exclude)
      for (let i = 0; i < exclude.length; i++) {
        const key = exclude[i];
        
        //if field exists will aded to final row
        if (preRow[key]) {
          delete preRow[key];
        }
      }
    }
  }

  return processed;
}
