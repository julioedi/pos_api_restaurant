declare namespace Express {
    export interface Request {
      user?: { id: number; username: string }; // Aquí puedes definir los campos que tenga tu usuario
    }
  }
  