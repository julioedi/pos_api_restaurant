declare namespace Express {
    export interface Request {
      user?: { id: number; slug: string }; // Aquí puedes definir los campos que tenga tu usuario
      queryObject?: Record<string, any>
      table?:string,
      cookies?:Record<string, any>
    }
  }
  