import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from './schemas/usuarios.schema';

@Injectable()
export class UsuariosService {
  constructor(@InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>) {}

  async create(createUsuarioDto: any): Promise<Usuario> {
    const createdUsuario = new this.usuarioModel(createUsuarioDto);
    return createdUsuario.save();
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioModel.find().exec();
  }

  async findOne(id: string): Promise<Usuario> {
    return this.usuarioModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<Usuario | undefined> {
    return this.usuarioModel.findOne({ email }).exec();  // Busca por el campo 'email'
  }

  async update(id: string, updateUsuarioDto: any): Promise<Usuario> {
    return this.usuarioModel.findByIdAndUpdate(id, updateUsuarioDto, { new: true }).exec();
  }

  async delete(id: string): Promise<any> {
    return this.usuarioModel.findByIdAndDelete(id).exec();
  }
}
