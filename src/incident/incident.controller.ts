import { Body, Controller, Get, Post, UseGuards, Param, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { CloseIncidentDto, RegisterIncidentDto } from './dto/incident.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Post('incident')
  async registerFailedAttempt(@Body() registerIncidentDto: RegisterIncidentDto) {
    return this.incidentService.loginFailedAttempt(registerIncidentDto.usuario);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('incident/:usuario')
  async getIncidentByUser(@Param('usuario') usuario: string) {
    try {
      const incident = await this.incidentService.getIncidentByUser(usuario);
      if (!incident) {
        return { message: `No se encontraron incidencias para el usuario '${usuario}'.` };
      }
      return incident;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error; // Lanza el error tal cual para manejar respuestas claras
      }
      throw new Error('Ocurrió un error al obtener las incidencias.'); // Manejo genérico de errores
    }
  }

  @Get('open')
  async getOpenIncident() {
    return this.incidentService.getOpenIncident();
  }

  @Post('close')
  async closeOpenIncident(@Body() closeIncidentDto: CloseIncidentDto) {
    return this.incidentService.closeIncident(closeIncidentDto);
  }
}
