// src/types/auth.ts

export interface UserInfoMin {
    ID: number;
    title: string;
    slug: string;
    status: number;
    featured_id: number;
    email: string;
    role: null | number[];
  }
  
  export interface verifyAuthUserResponse {
    info: {
      token: string;
      data: UserInfoMin;
    };
    auth: {
      iat: number;
      exp: number;
    };
  }
  