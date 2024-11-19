import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Configuracion, ConfiguracionDocument } from './schemas/configuracion.schema';

@Injectable()
export class ConfiguracionService {
  constructor(
    @InjectModel(Configuracion.name) private configuracionModel: Model<ConfiguracionDocument>,
  ) {}

  async getConfiguracion(): Promise<Configuracion> {
    const config = await this.configuracionModel.findOne().exec();
    if (!config) {
      throw new NotFoundException('Configuración no encontrada');
    }
    return config;
  }

  async updateConfiguracion(
    maxFailedAttempts: number,
    lockTimeMinutes: number,
  ): Promise<Configuracion> {
    const config = await this.configuracionModel.findOne();
    if (!config) {
      throw new NotFoundException('Configuración no encontrada');
    }
    config.maxFailedAttempts = maxFailedAttempts;
    config.lockTimeMinutes = lockTimeMinutes;
    return config.save();
  }

  // Crear un documento de configuración por defecto (opcional, si no existe)
  async createDefaultConfiguracion(): Promise<Configuracion> {
    const existingConfig = await this.configuracionModel.findOne().exec();
    if (existingConfig) return existingConfig;

    const defaultConfig = new this.configuracionModel({
      maxFailedAttempts: 5,
      lockTimeMinutes: 20,
    });
    return defaultConfig.save();
  }
}
