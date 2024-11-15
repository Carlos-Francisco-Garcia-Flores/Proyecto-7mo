import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentoRegulatorioController } from './documento-regulatorio.controller';
import { DocumentoRegulatorioService } from './documento-regulatorio.service';
import { DocumentoRegulatorio, DocumentoRegulatorioSchema } from './schemas/documento-regulatorio.schema.ts';
import { AuthModule } from '../auth/auth.module';  // Importamos AuthModule para usar JWT y autenticación

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentoRegulatorio.name, schema: DocumentoRegulatorioSchema }
    ]),
    AuthModule,
  ],
  controllers: [DocumentoRegulatorioController],
  providers: [DocumentoRegulatorioService],
})
export class DocumentoRegulatorioModule {}
