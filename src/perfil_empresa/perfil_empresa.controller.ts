import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { PerfilEmpresaService } from './perfil_empresa.service';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('perfil-empresa')
export class PerfilEmpresaController {
  constructor(private readonly perfilEmpresaService: PerfilEmpresaService) {}

  // Obtener el perfil de la empresa
  @Get()
  async obtenerPerfil() {
    return this.perfilEmpresaService.obtenerPerfil();
  }

  // Actualizar el perfil de la empresa
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Put()
  async actualizarPerfil(@Body() updatePerfilDto: UpdatePerfilDto) {
    return this.perfilEmpresaService.actualizarPerfil(updatePerfilDto);
  }
}
