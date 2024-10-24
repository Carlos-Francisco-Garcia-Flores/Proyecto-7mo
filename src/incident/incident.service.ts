import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Incident, IncidentDocument } from './schemas/incident.schema';
import { CloseIncidentDto, UsernameIsBlockedDto } from './dto/incident.dto';
import * as moment from 'moment';

@Injectable()
export class IncidentService {
    constructor(@InjectModel(Incident.name) private incidentModel: Model<IncidentDocument>) {}

    // TODO: Registrar una nueva incidencia
    async loginFailedAttempt(usuario: string): Promise<Incident> {
        const incident = await this.incidentModel.findOne({ usuario });
    
        // Obtener la hora actual en la zona horaria de México
        const now = moment().tz('America/Mexico_City').toDate();
    
        if (incident) {

            // Si la cuenta ya está bloqueada y el tiempo actual es menor a la fecha de expiración del bloqueo
            if (incident.isBlocked && now < incident.blockExpiresAt) {
                const bloqueoEnMexico = moment(incident.blockExpiresAt).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
                throw new ForbiddenException(
                    `La cuenta está bloqueada. Inténtalo nuevamente después de ${bloqueoEnMexico}`
                );
            }
    
            // Si el tiempo actual es mayor o igual a la fecha de expiración del bloqueo, desbloquear la cuenta
            if (incident.isBlocked && now >= incident.blockExpiresAt) {
                incident.failedAttempts = 0;  // Reiniciar contador
                incident.isBlocked = false;   // Desbloquear cuenta
                incident.blockExpiresAt = null; // Limpiar fecha de bloqueo
            }
    
            // Incrementar intentos fallidos
            incident.failedAttempts += 1;
            incident.lastAttempt = now;  // Registrar el intento con la hora de México
    
            // Si los intentos fallidos exceden 5, bloquear la cuenta por 20 minutos
            if (incident.failedAttempts > 5) {
                incident.isBlocked = true;
                incident.blockExpiresAt = moment().tz('America/Mexico_City').add(20, 'minutes').toDate();  // Bloquear por 20 minutos
            }
    
            return incident.save();
        } else {
            // Si no existe un incidente previo, crear uno nuevo
            const newIncident = new this.incidentModel({
                usuario: usuario,
                failedAttempts: 1,
                lastAttempt: now,  // Usar la hora de México para la fecha del intento
            });
            return newIncident.save();
        }
    }

    //TODO: Obtener una incidencia
    async getOpenIncident(): Promise<Incident[]> {
        return this.incidentModel.find({ status: 'open' }).exec();
    }

    async getOpenEmailIncident(): Promise<Incident[]> {
        return this.incidentModel.find({ status: 'open' }).exec();
    }

    //TODO: Cerrar una incidencia
    async closeIncident(closeIncidentDto: CloseIncidentDto): Promise<Incident> {
        const { usuario } = closeIncidentDto;
        return this.incidentModel.findOneAndUpdate(
            { usuario },
            { status: 'close', failedAttempts: 0, isBlocked: false, blockExpiresAt: null },
            { new: true},
        ).exec();
    }

    //TODO: Buscar si el usuario tiene bloqueada la cuenta
    async usernameIsBlocked(usernameIsBlockedDto: UsernameIsBlockedDto): Promise<Incident> {
        const { usuario } = usernameIsBlockedDto;
        const incident = await this.incidentModel.findOne({ usuario });
        return incident;
    }
}