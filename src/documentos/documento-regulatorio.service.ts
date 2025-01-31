import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentoRegulatorio } from './schemas/documento-regulatorio.schema.ts';
import { CreateDocumentoDto, UpdateDocumentoDto } from './dto/documento.dto';

@Injectable()
export class DocumentoRegulatorioService {
  constructor(
    @InjectModel(DocumentoRegulatorio.name) private documentoModel: Model<DocumentoRegulatorio>,
  ) {}

  private incrementVersion(version: string): string {
    const [major] = version.split('.').map(Number);
    return `${major + 1}.0`;
  }

  async createDocumento(createDocumentoDto: CreateDocumentoDto): Promise<DocumentoRegulatorio> {
    const { tipo } = createDocumentoDto;
  
    // Cambia cualquier documento vigente del mismo tipo a no vigente
    await this.documentoModel.updateMany({ tipo, vigente: true }, { vigente: false });
  
    // Buscar el documento más reciente del mismo tipo para obtener la última versión
    const ultimoDocumento = await this.documentoModel
      .findOne({ tipo })
      .sort({ version: -1 }) // Ordenar por versión de forma descendente
      .exec();
  
    let nuevaVersion = '1.0'; // Valor por defecto si no existe ningún documento
  
    if (ultimoDocumento) {
      // Incrementar la versión basada en el último documento
      const [major] = ultimoDocumento.version.split('.').map(Number); // Obtener la parte `x` de `x.0`
      nuevaVersion = `${major + 1}.0`;
    }
  
    const nuevoDocumento = new this.documentoModel({
      ...createDocumentoDto,
      version: nuevaVersion,
      fechaInicio: createDocumentoDto.fechaInicio || new Date(),
      vigente: true,
      eliminado: false,
    });
  
    return nuevoDocumento.save();
  }
  async getAllDocumentos(): Promise<DocumentoRegulatorio[]> {
    return this.documentoModel.find().exec();
  }

  // Método para obtener un documento por ID
  async obtenerDocumentoPorId(id: string): Promise<DocumentoRegulatorio> {
    const documento = await this.documentoModel.findById(id).exec();
    if (!documento) {
      throw new NotFoundException(`Documento con ID ${id} no encontrado`);
    }
    return documento;
  }

  async updateDocumento(id: string, updateDocumentoDto: UpdateDocumentoDto): Promise<DocumentoRegulatorio> {
    const documento = await this.documentoModel.findById(id);
    if (!documento) {
      throw new NotFoundException(`Documento con ID: ${id} no encontrado`);
    }

    

    // Desactivar el documento vigente actual
    documento.vigente = false;
    await documento.save();

    const nuevaVersion = new this.documentoModel({
      ...documento.toObject(),
      ...updateDocumentoDto,
      version: this.incrementVersion(documento.version),
      _id: undefined,
      vigente: true,
    });

    return nuevaVersion.save();
  }

  async deleteDocumento(id: string): Promise<DocumentoRegulatorio> {
    const documento = await this.documentoModel.findById(id);
    if (!documento) {
      throw new NotFoundException(`Documento con ID: ${id} no encontrado`);
    }
    documento.eliminado = true;
    documento.fechaFin = new Date(); 

    return documento.save();
  }
}