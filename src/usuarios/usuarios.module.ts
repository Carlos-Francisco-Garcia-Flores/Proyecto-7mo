import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import {UsuarioSchema } from './schemas/usuarios.schema';
import { AuthModule } from '../auth/auth.module';  // Importamos AuthModule para usar JWT y autenticación

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Usuario', schema: UsuarioSchema }]), AuthModule],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService], 
})
export class UsuariosModule {}
