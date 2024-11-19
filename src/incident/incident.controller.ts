import { Body, Controller, Get, Post, UseGuards, Param} from '@nestjs/common';
import { IncidentService } from './incident.service';
import { CloseIncidentDto, RegisterIncidentDto } from './dto/incident.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class IncidentController {
    constructor(private readonly incidentService:IncidentService) {}

    @Post('incident')
    async registerFailedAttempt(@Body() registerIncidentDto: RegisterIncidentDto) {
        return this.incidentService.loginFailedAttempt(registerIncidentDto.usuario);
    }

    @Get('incident/:usuario')
    async getIncidentByUser(@Param('usuario') usuario: string) {
    return this.incidentService.getIncidentByUser(usuario);
    }


    @Get('open')
    async getOpenIncident() {
        return this.incidentService.getOpenIncident();
    }

    
    @Get('correo/incidentes')
    async getOpenEmailIncident() {
        return this.incidentService.getOpenIncident();
    }

    @Post('close')
    async closeOpenIncident(@Body() closeIncidentDto: CloseIncidentDto) {
        return this.incidentService.closeIncident(closeIncidentDto);
    }
}