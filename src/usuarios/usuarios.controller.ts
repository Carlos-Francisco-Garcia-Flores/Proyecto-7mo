import { Body, Controller, Get, Post, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';


@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}



  @UseGuards(AuthGuard('jwt'), RolesGuard)  // Protegemos la ruta con autenticación JWT y Roles
  @Roles('admin')  // Solo accesible para administradores
  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  // @UseGuards(AuthGuard('jwt'), RolesGuard)  // Protegemos la ruta con autenticación JWT y Roles
  // @Roles('admin')  // Solo accesible para administradores
  // @Get('buscar')
  // findOne(@Param('id') id: string) {
  //   return this.usuariosService.findOne(id);
  // }

  @UseGuards(AuthGuard('jwt'), RolesGuard)  // Protegemos la ruta con autenticación JWT y Roles
  @Roles('admin')  // Solo accesible para administradores
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.delete(id);
  }
}
