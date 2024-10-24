import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuarios, UserSchema } from './schemas/user.schema';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from '../services/email.service';
import { OtpService } from '../services/otp.service';
import { PwnedService } from '../services/pwned.service';
import { ZxcvbnService } from '../services/zxcvbn.service';
import { IncidentModule } from '../incident/incident.module';
import { JwtStrategy } from '../common/strategies/jwt.strategy';  // Importar JwtStrategy

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: Usuarios.name,
        schema: UserSchema,
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),  // Obtener la clave secreta desde variables de entorno
        signOptions: { expiresIn: '1h' },  // El token expira en 1 hora
      }),
      inject: [ConfigService],
    }),
    IncidentModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    PwnedService,
    ZxcvbnService,
    OtpService,
    JwtStrategy,  
  ],
  exports: [AuthService, JwtModule],  // Exportando JwtModule si otros módulos necesitan generar/verificar tokens
})
export class AuthModule {}
