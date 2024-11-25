import { ForbiddenException, Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Incident, IncidentDocument } from './schemas/incident.schema';
import { Configuracion, ConfiguracionDocument } from '../configuracion/schemas/configuracion.schema';
import { CloseIncidentDto, UsernameIsBlockedDto } from './dto/incident.dto';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class IncidentService {
  constructor(
    @InjectModel(Incident.name) private incidentModel: Model<IncidentDocument>,
    @InjectModel(Configuracion.name) private configuracionModel: Model<ConfiguracionDocument>,
    @Inject(forwardRef(() => UsuariosService)) private readonly usuariosService: UsuariosService,
  ) {}

  // Obtener configuración
  private async getConfiguracion(): Promise<ConfiguracionDocument> {
    const config = await this.configuracionModel.findOne().exec();
    if (!config) {
      throw new Error('Configuración no encontrada en la base de datos');
    }
    return config;
  }

  // Registrar una nueva incidencia o manejar intentos fallidos
  async loginFailedAttempt(usuario: string): Promise<Incident> {
    const config = await this.getConfiguracion();
    const maxFailedAttempts = config.maxFailedAttempts;
    const lockTimeMinutes = config.lockTimeMinutes;

    const incident = await this.incidentModel.findOne({ usuario });
    const now = new Date();

    if (incident) {
      // Si está bloqueado, verificar si ya pasó el tiempo de desbloqueo
      if (incident.isBlocked && now < incident.blockExpiresAt) {
        throw new ForbiddenException(
          `La cuenta está bloqueada. Inténtalo nuevamente después de ${new Date(
            incident.blockExpiresAt,
          ).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
        );
      }

      if (incident.isBlocked && now >= incident.blockExpiresAt) {
        // Reiniciar si el tiempo de bloqueo expiró
        incident.failedAttempts = 0;
        incident.isBlocked = false;
        incident.blockExpiresAt = null;
      }

      // Verificar si el siguiente intento fallido excederá el límite
      if (incident.failedAttempts + 1 >= maxFailedAttempts) {
        incident.isBlocked = true;
        incident.blockExpiresAt = new Date(now.getTime() + lockTimeMinutes * 60 * 1000);
      } else {
        // Incrementar intentos fallidos si no se excede el límite
        incident.failedAttempts += 1;
      }

      // Incrementar el contador total de intentos fallidos
      incident.totalFailedAttempts = (incident.totalFailedAttempts || 0) + 1;
      incident.lastAttempt = now;

      return incident.save();
    } else {
      // Crear una nueva incidencia
      const newIncident = new this.incidentModel({
        usuario,
        failedAttempts: 1,
        totalFailedAttempts: 1, // Comienza con el primer intento
        lastAttempt: now,
      });
      return newIncident.save();
    }
  }

  // Obtener incidencia abierta
  async getOpenIncident(): Promise<Incident[]> {
    return this.incidentModel.find({ status: 'open' }).exec();
  }

  // Mostrar incidencia por usuario 
  async getIncidentByUser(usuario: string): Promise<Incident | null> {
    // Verificar si el usuario está bloqueado por un administrador
    const user = await this.usuariosService.findByUser(usuario);
    if (!user) {
      throw new NotFoundException(`Usuario '${usuario}' no encontrado.`);
    }

    if (user.bloqueado) {
      throw new ForbiddenException('El usuario ha sido bloqueado por un administrador.');
    }

    return this.incidentModel.findOne({ usuario }).exec();
  }

  // Cerrar una incidencia
  async closeIncident(closeIncidentDto: CloseIncidentDto): Promise<Incident> {
    const { usuario } = closeIncidentDto;
    return this.incidentModel.findOneAndUpdate(
      { usuario },
      {
        status: 'close',
        failedAttempts: 0,
        isBlocked: false,
        blockExpiresAt: null,
      },
      { new: true },
    ).exec();
  }

  // Verificar si el usuario está bloqueado
  async usernameIsBlocked(usernameIsBlockedDto: UsernameIsBlockedDto): Promise<Incident> {
    const { usuario } = usernameIsBlockedDto;
    const incident = await this.incidentModel.findOne({ usuario });

    if (incident) {
      const now = new Date();

      // Desbloquear si el tiempo de bloqueo ya pasó
      if (incident.isBlocked && now >= incident.blockExpiresAt) {
        incident.isBlocked = false;
        incident.failedAttempts = 0;
        incident.blockExpiresAt = null;
        await incident.save();
      }
    }

    return incident;
  }
}
