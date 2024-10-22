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
        secret: configService.get<string>('JWT_SECRET'), // Asegúrate de que la clave esté configurada
        signOptions: { expiresIn: '1h' }, // Configuración de expiración del token
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
  ],
  exports: [AuthService],
})
export class AuthModule {}