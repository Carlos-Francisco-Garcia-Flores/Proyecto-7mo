import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import {UsuarioSchema } from './schemas/usuarios.schema';
import { AuthModule } from '../auth/auth.module';  // Importamos AuthModule para usar JWT y autenticación
import { IncidentModule } from '../incident/incident.module';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Usuario', schema: UsuarioSchema }]), AuthModule,     forwardRef(() => IncidentModule), // Resuelve posibles dependencias circulares
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService], 
})
export class UsuariosModule {}
