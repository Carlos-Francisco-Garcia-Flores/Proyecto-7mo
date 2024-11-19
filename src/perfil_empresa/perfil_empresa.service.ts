import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PerfilEmpresa, PerfilEmpresaDocument } from './schemas/perfil_empresa.schema';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { cloudinary } from '../cloudinary/cloudinary.provider'; // Configuración de Cloudinary

@Injectable()
export class PerfilEmpresaService {
  constructor(
    @InjectModel(PerfilEmpresa.name) private perfilEmpresaModel: Model<PerfilEmpresaDocument>,
  ) {}

  // Obtener el perfil de la empresa
  async obtenerPerfil(): Promise<PerfilEmpresa> {
    const perfil = await this.perfilEmpresaModel.findOne().exec();
    if (!perfil) {
      throw new NotFoundException('El perfil de la empresa no está configurado');
    }
    return perfil;
  }

  // Actualizar el perfil de la empresa
  async actualizarPerfil(updatePerfilDto: UpdatePerfilDto): Promise<PerfilEmpresa> {
    const perfil = await this.perfilEmpresaModel.findOne();
    if (!perfil) {
      throw new NotFoundException('El perfil de la empresa no está configurado');
    }

    // Si hay una nueva URL de logotipo, validar y actualizar
    if (updatePerfilDto.logo) {
      const validado = await this.validarLogo(updatePerfilDto.logo);
      if (!validado) {
        throw new Error('El logotipo proporcionado no es válido o no pudo ser procesado');
      }
    }

    // Actualizar los campos del perfil
    Object.assign(perfil, updatePerfilDto);
    return perfil.save();
  }

  // Validar y subir logotipo a Cloudinary (opcional)
  private async validarLogo(logoUrl: string): Promise<boolean> {
    try {
      // Puedes implementar una validación adicional si es necesario
      const result = await cloudinary.uploader.upload(logoUrl, {
        folder: 'perfil_empresa',
      });
      return !!result.url; // Retorna true si la subida fue exitosa
    } catch (error) {
      console.error('Error validando el logo:', error);
      return false;
    }
  }
}
