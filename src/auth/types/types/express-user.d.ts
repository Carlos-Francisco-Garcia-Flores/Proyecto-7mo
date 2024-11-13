import { Request } from 'express';

declare module 'express' {
  export interface Request {
    user?: {
        _id: string;
      usuario: string;
      role: string;
    };
  }
}
