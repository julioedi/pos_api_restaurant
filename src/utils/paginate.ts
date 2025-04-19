import db from "../config/db";
import { tableSchemas } from "../config/tableSchemas";

interface PaginationParams {
    table: string;
    page?: number;
    limit?: number;
    search?: string;
}

export async function paginate({ table, page = 1, limit = 10, search = "" }: PaginationParams) {
    const schema = tableSchemas[table];
    if (!schema) throw new Error(`Table schema for '${table}' not found`);

    const offset = (page - 1) * limit;
    const fields = schema.fields_in_child?.length ? schema.fields_in_child.join(", ") : "*";
    const jsonFields = schema.json || [];
    const intFields = schema.int || [];

    // 🔎 Construcción del filtro de búsqueda
    let whereClause = "";
    if (search) {
        const searchFields = Object.keys(schema.cols || {}).filter(col => typeof col === "string");
        const likeConditions = searchFields.map(col => `${col} LIKE '%${search}%'`);
        if (likeConditions.length) {
            whereClause = `WHERE ${likeConditions.join(" OR ")}`;
        }
    }
    // 🔢 Consulta principal
    const query = `SELECT ${fields} FROM ${table} ${whereClause} ORDER BY ID DESC LIMIT ? OFFSET ?`;
    const rows = await (await db).all(query, [limit, offset]);

    // 📊 Conteo total
    const countQuery = `SELECT COUNT(*) as total FROM ${table} ${whereClause}`;
    const countResult = await (await db).get(countQuery); // Solo obtenemos un resultado
    const total: number = countResult?.total ?? 0;


    // 🧠 Procesar resultados
    const processed = rows.map((row: any) => {
        const result: any = {};

        for (const key in row) {
            const value = row[key];

            if (jsonFields.includes(key)) {
                try {
                    result[key] = value ? JSON.parse(value) : null;
                } catch {
                    result[key] = null;
                }
            } else if (intFields.includes(key)) {
                result[key] = Number(value);
            } else {
                result[key] = value;
            }
        }

        return result;
    });

    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: processed,
    };
}
