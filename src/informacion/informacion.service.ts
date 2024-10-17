import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInformacionDto } from './dto/create-informacion.dto';
import { Informacion, InformacionDocument } from './schemas/nformacion.schema';

@Injectable()
export class InformacionService {
  constructor(
    @InjectModel(Informacion.name) private informacionModel: Model<InformacionDocument>,
  ) {}

  // Crear una nueva entrada de información
  async create(createInformacionDto: CreateInformacionDto): Promise<Informacion> {
    const createdInformacion = new this.informacionModel(createInformacionDto);
    return createdInformacion.save();
  }

  // Obtener todas las entradas de información
  async findAll(): Promise<Informacion[]> {
    return this.informacionModel.find().exec();
  }

  // Obtener una entrada de información por ID
  async findOne(id: string): Promise<Informacion> {
    const info = await this.informacionModel.findById(id).exec();
    if (!info) {
      throw new NotFoundException(`Información con ID ${id} no encontrada`);
    }
    return info;
  }

  // Actualizar una entrada de información por ID
  async update(id: string, updateInformacionDto: CreateInformacionDto): Promise<Informacion> {
    const updatedInfo = await this.informacionModel
      .findByIdAndUpdate(id, updateInformacionDto, { new: true })
      .exec();
    if (!updatedInfo) {
      throw new NotFoundException(`Información con ID ${id} no encontrada`);
    }
    return updatedInfo;
  }

  // Eliminar una entrada de información por ID
  async remove(id: string): Promise<Informacion> {
    const deletedInfo = await this.informacionModel.findByIdAndDelete(id).exec();
    if (!deletedInfo) {
      throw new NotFoundException(`Información con ID ${id} no encontrada`);
    }
    return deletedInfo;
  }
}
