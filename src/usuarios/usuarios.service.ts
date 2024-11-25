import { Injectable, NotFoundException } from '@nestjs/common';
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

  async toggleBloqueo(id: string, bloquear: boolean): Promise<Usuario> {
    const usuario = await this.usuarioModel.findById(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    usuario.bloqueado = bloquear;
    return usuario.save();
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioModel.find().exec();
  }

  async findOne(id: string): Promise<Usuario> {
    return this.usuarioModel.findById(id).exec();
  }

  async findByEmail(correo_Electronico: string): Promise<Usuario | undefined> {
    return this.usuarioModel.findOne({ correo_Electronico }).exec();  // Busca por el campo 'correo_electronico'
  }

  async findByUser(usuario: string): Promise<Usuario | undefined> {
    return this.usuarioModel.findOne({ usuario }).exec();  // Busca por el campo 'usuario'
  }


  async update(id: string, updateUsuarioDto: any): Promise<Usuario> {
    return this.usuarioModel.findByIdAndUpdate(id, updateUsuarioDto, { new: true }).exec();
  }

  async delete(id: string): Promise<any> {
    return this.usuarioModel.findByIdAndDelete(id).exec();
  }
}
