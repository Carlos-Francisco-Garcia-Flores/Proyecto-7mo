import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PerfilEmpresa, PerfilEmpresaDocument } from './schemas/perfil_empresa.schema';
import { UpdatePerfilEmpresaDto } from './dto/update-perfil_empresa.dto';

@Injectable()
export class PerfilEmpresaService {
  constructor(
    @InjectModel(PerfilEmpresa.name) private perfilEmpresaModel: Model<PerfilEmpresaDocument>,
  ) {}

  async obtenerPerfil(): Promise<PerfilEmpresa> {
    const perfil = await this.perfilEmpresaModel.findOne().exec();
    if (!perfil) {
      throw new NotFoundException('Perfil de la empresa no encontrado');
    }
    return perfil;
  }

  async actualizarPerfil(updateDto: UpdatePerfilEmpresaDto): Promise<PerfilEmpresa> {
    const perfil = await this.perfilEmpresaModel.findOneAndUpdate({}, updateDto, {
      new: true,
      upsert: true, // Crea el documento si no existe
    }).exec();
    return perfil;
  }

  async actualizarCampo(campo: string, valor: string): Promise<PerfilEmpresa> {
    if (!['eslogan', 'mision', 'vision'].includes(campo)) {
      throw new BadRequestException(`El campo ${campo} no es válido`);
    }
  
    const updateObject = { [campo]: valor };
  
    const perfil = await this.perfilEmpresaModel.findOneAndUpdate(
      {},
      { $set: updateObject },
      { new: true, upsert: true }, // Crear si no existe
    );
  
    if (!perfil) {
      throw new NotFoundException('Perfil de la empresa no encontrado');
    }
  
    return perfil;
  }
  
}
