import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PerfilEmpresaService } from './perfil_empresa.service';
import { PerfilEmpresaController } from './perfil_empresa.controller';
import { PerfilEmpresa, PerfilEmpresaSchema } from './schemas/perfil_empresa.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PerfilEmpresa.name, schema: PerfilEmpresaSchema },
    ]),
  ],
  controllers: [PerfilEmpresaController],
  providers: [PerfilEmpresaService],
})
export class PerfilEmpresaModule {}
