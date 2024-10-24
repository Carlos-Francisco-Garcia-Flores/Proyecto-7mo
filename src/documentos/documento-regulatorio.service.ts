import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentoRegulatorio } from './schemas/documento-regulatorio.schema.ts';
import { CrearDocumentoDto, ModificarDocumentoDto } from './dto/documento.dto';

@Injectable()
export class DocumentoRegulatorioService {
  constructor(
    @InjectModel('DocumentoRegulatorio') private readonly documentoModel: Model<DocumentoRegulatorio>
  ) {}

  // Crear un nuevo documento regulatorio
  async crearDocumento(dto: CrearDocumentoDto): Promise<DocumentoRegulatorio> {
    const nuevoDocumento = new this.documentoModel({
      tipo: dto.tipo,
      descripcion: dto.descripcion,
      fechaInicio: dto.fechaInicio,
      fechaFin: dto.fechaFin,
      version: '1.0',
      vigente: true,
      eliminado: false,
      fechaCreacion: new Date(),
    });
    return await nuevoDocumento.save();
  }

  // Obtener todos los documentos no eliminados
  async obtenerDocumentos(): Promise<DocumentoRegulatorio[]> {
    return this.documentoModel.find({ eliminado: false }).exec();
  }

  // Obtener la versión vigente de un documento
  async obtenerDocumentoVigente(tipo: string): Promise<DocumentoRegulatorio> {
    return this.documentoModel.findOne({ tipo, vigente: true, eliminado: false }).exec();
  }

  // Obtener el historial completo de versiones de un documento
  async obtenerHistorialDeVersiones(tipo: string): Promise<DocumentoRegulatorio[]> {
    return this.documentoModel.find({ tipo }).sort({ fechaCreacion: -1 }).exec();
  }

  // Modificar un documento, creando una nueva versión
  async modificarDocumento(id: string, dto: ModificarDocumentoDto): Promise<DocumentoRegulatorio> {
    const documento = await this.documentoModel.findById(id).exec();  
    if (!documento) {
      throw new NotFoundException('Documento no encontrado');
    }
  
    // Accedemos correctamente a fechaInicio en un documento plano
    const nuevaVersion = new this.documentoModel({
      tipo: documento.tipo,
      descripcion: dto.descripcion,
      fechaInicio: documento.fechaInicio, 
      fechaFin: dto.fechaFin || documento.fechaFin,
      version: incrementarVersion(documento.version),
      vigente: true,
      eliminado: false,
      fechaCreacion: new Date(),
    });
  
    return await nuevaVersion.save();
  }

  // Eliminar documento lógicamente (no borrar físicamente)
  async eliminarDocumento(id: string): Promise<DocumentoRegulatorio> {
    const documento = await this.documentoModel.findById(id);

    if (!documento) {
      throw new NotFoundException('Documento no encontrado');
    }

    documento.eliminado = true;
    return await documento.save();
  }
}

// Función auxiliar para incrementar la versión
function incrementarVersion(version: string): string {
  const [major, minor] = version.split('.').map(Number);
  return `${major}.${minor + 1}`;
}
