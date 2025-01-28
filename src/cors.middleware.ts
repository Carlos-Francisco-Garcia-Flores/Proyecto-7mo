import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const allowedOrigins = 'http://localhost:5173/';
   
    // const allowedOrigins = ['http://localhost:5173/', 'https://beatbox.developers506.com', 'https://beatbox-blond.vercel.app', 'https://beat-box.com', 'https://beat-box.com:8080', 'https://beatbox.com', 'https://beatbox.com:8080'];
    const origin = req.headers.origin as string;

      res.header('Access-Control-Allow-Origin', allowedOrigins);
    

    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    next();
  }
}