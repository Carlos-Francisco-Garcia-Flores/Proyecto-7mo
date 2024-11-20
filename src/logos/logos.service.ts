import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logo, LogoDocument } from './schemas/logo.schema';

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

  // Eliminar un logo por su ID
  async delete(id: string): Promise<void> {
    const deletedLogo = await this.logoModel.findByIdAndDelete(id).exec();
    if (!deletedLogo) {
      throw new NotFoundException(`Logo con ID ${id} no encontrado.`);
    }
  }
}