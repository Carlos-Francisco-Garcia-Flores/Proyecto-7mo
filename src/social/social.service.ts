import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedSocial, RedSocialDocument } from './schemas/red-social.schema';

@Injectable()
export class SocialService {
  constructor(
    @InjectModel(RedSocial.name) private redSocialModel: Model<RedSocialDocument>,
  ) {}

  // Crear o actualizar una red social
  async createOrUpdate(tipo: string, link: string): Promise<RedSocial> {
    const existingRedSocial = await this.redSocialModel.findOne({ tipo });
    if (existingRedSocial) {
      existingRedSocial.link = link;
      return existingRedSocial.save();
    }
    const newRedSocial = new this.redSocialModel({ tipo, link });
    return newRedSocial.save();
  }

  // Obtener todas las redes sociales
  async findAll(): Promise<RedSocial[]> {
    return this.redSocialModel.find().exec();
  }

  // Obtener una red social por tipo
  async findOne(tipo: string): Promise<RedSocial> {
    const redSocial = await this.redSocialModel.findOne({ tipo }).exec();
    if (!redSocial) throw new NotFoundException(`Red social tipo ${tipo} no encontrada`);
    return redSocial;
  }

  // Eliminar una red social por tipo
  async remove(tipo: string): Promise<void> {
    const result = await this.redSocialModel.deleteOne({ tipo }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Red social tipo ${tipo} no encontrada`);
    }
  }
}
