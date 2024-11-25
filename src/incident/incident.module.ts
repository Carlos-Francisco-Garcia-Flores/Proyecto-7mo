import { Module, forwardRef  } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IncidentSchema } from './schemas/incident.schema';
import { IncidentController } from './incident.controller';
import { IncidentService } from './incident.service';
import { ConfiguracionModule } from '../configuracion/configuracion.module';
import { UsuariosModule } from '../usuarios/usuarios.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Incident', schema: IncidentSchema }
    ]),
    ConfiguracionModule,
    forwardRef(() => UsuariosModule), // Manejar dependencias circulares
  ],
  controllers: [IncidentController],
  providers: [IncidentService],
  exports: [IncidentService]
})
export class IncidentModule {}  