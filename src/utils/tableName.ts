import { Request } from "express";

export const tableName = (req:Request):string =>{
    let path = `${req.originalUrl}`;
    path = path.replace(/^.*?api\/(.*?)(\/.*?$|$)/,"$1");
    if (!req.table) {
        req.table = path;
    }
    return path;
}