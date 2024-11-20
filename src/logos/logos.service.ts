import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logo, LogoDocument } from './schemas/logo.schema';
import { cloudinary } from '../cloudinary/cloudinary.provider';

@Injectable()
export class LogosService {
  constructor(@InjectModel(Logo.name) private logoModel: Model<LogoDocument>) {}

  // Crear un nuevo logo y establecerlo como vigente
  async create(link: string): Promise<Logo> {
    // Marcar como no vigente todos los logos existentes
    await this.logoModel.updateMany({}, { vigente: false }).exec();

    // Crear y guardar el nuevo logo como vigente
    const newLogo = new this.logoModel({ link, vigente: true });
    return newLogo.save();
  }

  // Obtener todos los documentos de la colección
  async findAll(): Promise<Logo[]> {
    return this.logoModel.find().exec();
  }

  // Obtener el logo vigente
  async findVigente(): Promise<Logo> {
    const vigenteLogo = await this.logoModel.findOne({ vigente: true }).exec();
    if (!vigenteLogo) {
      throw new NotFoundException('No hay ningún logo vigente.');
    }
    return vigenteLogo;
  }

  // Establecer un logo específico como vigente
  async setVigente(id: string): Promise<Logo> {
    // Marcar como no vigente todos los logos existentes
    await this.logoModel.updateMany({}, { vigente: false }).exec();

    // Establecer el logo especificado como vigente
    const updatedLogo = await this.logoModel.findByIdAndUpdate(
      id,
      { vigente: true },
      { new: true },
    );

    if (!updatedLogo) {
      throw new NotFoundException(`Logo con ID ${id} no encontrado.`);
    }

    return updatedLogo;
  }

  // Eliminar un logo por su ID, incluyendo su eliminación en Cloudinary
  async delete(id: string): Promise<void> {
    const logo = await this.logoModel.findById(id).exec();

    if (!logo) {
      throw new NotFoundException(`Logo con ID ${id} no encontrado.`);
    }

    // Extraer el publicId de la URL de Cloudinary
    const publicId = this.extractPublicIdFromUrl(logo.link);

    if (publicId) {
      try {
        // Intentar eliminar la imagen de Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result !== 'ok') {
          console.warn(`No se pudo eliminar la imagen de Cloudinary con publicId: ${publicId}`);
        }
      } catch (error) {
        console.error(`Error al eliminar la imagen de Cloudinary: ${error.message}`);
      }
    }

    // Eliminar el documento de la base de datos
    await logo.deleteOne();
  }

  // Método para extraer el publicId de una URL de Cloudinary
  private extractPublicIdFromUrl(url: string): string | null {
    const regex = /\/([^/]+)\.[a-zA-Z]+$/; // Coincide con el nombre del archivo antes de la extensión
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}
