import { Controller, Post, Get, Put, Patch, Param, Body, UseGuards, NotFoundException } from '@nestjs/common';
import { DocumentoRegulatorioService } from './documento-regulatorio.service';
import { CrearDocumentoDto, ModificarDocumentoDto } from './dto/documento.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('documento-regulatorio')
export class DocumentoRegulatorioController {
  constructor(private readonly documentoService: DocumentoRegulatorioService) {}

  @Get('vigente/:tipo')
  async obtenerDocumentoVigente(@Param('tipo') tipo: string) {
    console.log('Buscando documento del tipo:', tipo);  // Log para verificar el tipo recibido
    const documento = await this.documentoService.obtenerDocumentoVigente(tipo);

    if (!documento) {
      throw new NotFoundException('No hay versiones vigentes para este documento');
    }

    return documento;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)  // Protegemos la ruta con autenticación JWT y Roles
  @Roles('admin')  // Solo accesible para administradores
  @Post()
  async crearDocumento(@Body() dto: CrearDocumentoDto) {
    return await this.documentoService.crearDocumento(dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)  // Protegemos la ruta con autenticación JWT y Roles
  @Roles('admin')  // Solo accesible para administradores
  @Get()
  async obtenerDocumentos() {
    return await this.documentoService.obtenerDocumentos();
  }

  
 

  @UseGuards(AuthGuard('jwt'), RolesGuard)  // Protegemos la ruta con autenticación JWT y Roles
  @Roles('admin')  // Solo accesible para administradores
  @Get('historial/:tipo')
  async obtenerHistorial(@Param('tipo') tipo: string) {
    return await this.documentoService.obtenerHistorialDeVersiones(tipo);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)  // Protegemos la ruta con autenticación JWT y Roles
  @Roles('admin')  // Solo accesible para administradores
  @Put(':id')
  async modificarDocumento(@Param('id') id: string, @Body() dto: ModificarDocumentoDto) {
    const documento = await this.documentoService.modificarDocumento(id, dto);

    if (!documento) {
      throw new NotFoundException('Documento no encontrado');
    }

    return documento;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)  // Protegemos la ruta con autenticación JWT y Roles
  @Roles('admin')  // Solo accesible para administradores
  @Patch(':id/eliminar')
  async eliminarDocumento(@Param('id') id: string) {
    const documento = await this.documentoService.eliminarDocumento(id);

    if (!documento) {
      throw new NotFoundException('Documento no encontrado o ya eliminado');
    }

    return documento;
  }
}
