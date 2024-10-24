import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // Extrae el token del encabezado Authorization
      ignoreExpiration: false,  // Verifica si el token ha expirado
      secretOrKey: configService.get<string>('JWT_SECRET'),  // Obtiene la clave secreta desde las variables de entorno
    });
  }

  // Método que valida el token JWT y retorna el payload decodificado
  async validate(payload: any) {
    if (!payload) {
      console.error('Token inválido o no proporcionado');  
      throw new UnauthorizedException('Token JWT inválido');
    }
    console.log('Payload JWT:', payload);  
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
