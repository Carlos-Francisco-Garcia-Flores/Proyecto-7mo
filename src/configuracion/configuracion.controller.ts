import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';


@Controller('configuracion')
export class ConfiguracionController {
  constructor(private readonly configuracionService: ConfiguracionService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get()
  async getConfiguracion() {
    return this.configuracionService.getConfiguracion();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch()
  async updateConfiguracion(
    @Body('maxFailedAttempts') maxFailedAttempts: number,
    @Body('lockTimeMinutes') lockTimeMinutes: number,
  ) {
    return this.configuracionService.updateConfiguracion(maxFailedAttempts, lockTimeMinutes);
  }
}
