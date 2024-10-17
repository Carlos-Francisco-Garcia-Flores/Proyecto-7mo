import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InformacionService } from './informacion.service';
import { InformacionController } from './informacion.controller';
import { Informacion, InformacionSchema } from './schemas/nformacion.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Informacion.name, schema: InformacionSchema }])],
  controllers: [InformacionController],
  providers: [InformacionService],
})
export class InformacionModule {}
