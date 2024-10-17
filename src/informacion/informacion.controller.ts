import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { InformacionService } from './informacion.service';
import { CreateInformacionDto } from './dto/create-informacion.dto';

@Controller('informacion')
export class InformacionController {
  constructor(private readonly informacionService: InformacionService) {}

  // Crear una nueva entrada de información
  @Post()
  async create(@Body() createInformacionDto: CreateInformacionDto) {
    return await this.informacionService.create(createInformacionDto);
  }

  // Obtener todas las entradas de información
  @Get()
  async findAll() {
    return await this.informacionService.findAll();
  }

  // Obtener una entrada de información por ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.informacionService.findOne(id);
  }

  // Actualizar una entrada de información por ID
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInformacionDto: CreateInformacionDto,
  ) {
    return await this.informacionService.update(id, updateInformacionDto);
  }

  // Eliminar una entrada de información por ID
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.informacionService.remove(id);
  }
}
