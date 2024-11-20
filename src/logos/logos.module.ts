import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogosService } from './logos.service';
import { LogosController } from './logos.controller';
import { Logo, LogoSchema } from './schemas/logo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Logo.name, schema: LogoSchema }]),
  ],
  controllers: [LogosController],
  providers: [LogosService],
})
export class LogosModule {}
