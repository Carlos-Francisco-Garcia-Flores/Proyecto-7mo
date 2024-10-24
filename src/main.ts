const cookieSession = require('cookie-session');
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  app.use(helmet());

  app.use(
    cookieSession({
      name: 'session',
      keys: [
        configService.get<string>("MASTER_COOKIE_KEY_V1"),
        configService.get<string>("MASTER_COOKIE_KEY_V2")
      ],
      cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 3600000
      }
    })
  );

  mongoose.set('sanitizeFilter', true);

  await app.listen(configService.get<number>("PORT"));
}

bootstrap();
