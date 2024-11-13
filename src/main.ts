import * as cookieParser from 'cookie-parser';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);


  app.use(cookieParser());  // Habilitar cookie-parser para leer cookies

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));


  app.use(helmet());



  mongoose.set('sanitizeFilter', true);

  await app.listen(configService.get<number>("PORT"));
  console.log(`Listen in http://localhost:${configService.get<number>("PORT")}`,);

}

bootstrap();
