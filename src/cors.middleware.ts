import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const allowedOrigins = ['http://localhost:5173', 'https://orangered-ape-514605.hostingersite.com']; // Dominios permitidos
    const origin = req.headers.origin as string;

    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin); // Establece el origen específico
    }

    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, Content-Disposition');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    next();
  }
}
