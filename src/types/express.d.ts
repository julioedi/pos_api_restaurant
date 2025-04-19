declare namespace Express {
    export interface Request {
      user?: { id: number; slug: string }; // Aquí puedes definir los campos que tenga tu usuario
    }
  }
  