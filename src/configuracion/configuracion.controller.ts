import { Body, Controller, Get, Put, Param, UseGuards } from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Configuracion} from './schemas/configuracion.schema'

@Controller('configuracion')
export class ConfiguracionController {
  constructor(private readonly configuracionService: ConfiguracionService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get()
  async getConfiguracion() {
    return this.configuracionService.getConfiguracion();
  }

  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('admin')
  // @Patch()
  // async updateConfiguracion(
  //   @Body('maxFailedAttempts') maxFailedAttempts: number,
  //   @Body('lockTimeMinutes') lockTimeMinutes: number,
  // ) {
  //   return this.configuracionService.updateConfiguracion(maxFailedAttempts, lockTimeMinutes);
  // }


  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Put(':campo')
  async actualizarCampo
    (
      @Param('campo') campo: string,
      @Body('valor') valor: string,
    ): Promise<Configuracion> {
    return this.configuracionService.updateConfiguracion(campo, valor);
  }
}
