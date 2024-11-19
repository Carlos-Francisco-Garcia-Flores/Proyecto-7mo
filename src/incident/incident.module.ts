import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IncidentSchema } from './schemas/incident.schema';
import { IncidentController } from './incident.controller';
import { IncidentService } from './incident.service';
import { ConfiguracionModule } from '../configuracion/configuracion.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Incident', schema: IncidentSchema }
    ]),
    ConfiguracionModule,
  ],
  controllers: [IncidentController],
  providers: [IncidentService],
  exports: [IncidentService]
})
export class IncidentModule {}  