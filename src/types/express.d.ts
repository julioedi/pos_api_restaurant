declare namespace Express {
  export interface Request {
    user?: { id: number; slug: string }; // Aquí puedes definir los campos que tenga tu usuario
    queryObject?: Record<string, any>
    table?: string,
    cookies?: Record<string, any>
    token?: {
      info: {
        token: string;
        data: {
          ID: number;
          title: string;
          slug: string;
          status: number;
          featured_id: number;
          email: string;
          role: null | number[];
        }
      }
      auth: {
        iat: number;
        exp: number;
      }
    }
  }
}