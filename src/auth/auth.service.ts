import * as bcrypt from 'bcrypt';
import { BadRequestException, ConflictException, ForbiddenException, Injectable, HttpStatus , UnauthorizedException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuarios, UserDocument } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/resetPassword.dto';
import { randomBytes } from 'crypto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto, ActivationDto } from './dto/register.dto';
import { EmailService } from '../services/email.service';
import { OtpService } from '../services/otp.service';
import { PwnedService } from '../services/pwned.service';
import { ZxcvbnService } from '../services/zxcvbn.service';
import { IncidentService } from '../incident/incident.service';
import { Response } from 'express'; 
import { Res } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';


@Injectable()
export class AuthService {
  private generateSessionID(): string {
    return randomBytes(32).toString('hex');
  }

  constructor(
    @InjectModel(Usuarios.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private incidentService: IncidentService,
    private emailService: EmailService,
    private pwnedservice: PwnedService,
    private zxcvbnService: ZxcvbnService,
    private otpService: OtpService
  ) {}

  // Registro de usuario, hasheo de contraseña
  async register(registerDto: RegisterDto): Promise<any> {
    const { sessionId, usuario, contraseña, correo_Electronico } = registerDto;
  
    console.log('Iniciando registro...'); // Log antes del inicio del flujo
  
    const user = await this.userModel.findOne({ usuario, correo_Electronico });
  
    if (user) {
      console.log('Usuario ya registrado:', usuario); // Log si el usuario ya existe
      throw new ConflictException({
        message: `El usuario '${user.usuario}' ya se encuentra registrado`,
        error: 'Conflict',
      });
    }
  
    console.log('Verificando contraseña con zxcvbn...'); // Log antes de la validación de la contraseña
  
    // Verificar la contraseña con zxcvbn
    try {
      const zxcvbnResult = this.zxcvbnService.validatePassword(contraseña);
  
      // Si zxcvbnResult no es null, significa que la contraseña es débil
      if (zxcvbnResult) {
        console.log('Contraseña débil:', contraseña); // Log si la contraseña es débil
        throw new BadRequestException({
          message: 'La contraseña ingresada es débil',
          error: 'BadRequest',
        });
      }
  
      console.log('Contraseña validada correctamente'); // Log cuando la contraseña pasa la validación
  
    } catch (error) {
      console.error('Error durante la validación de contraseña:', error);
      throw new BadRequestException('Error al verificar la contraseña');
    }
  
    console.log('Verificando si la contraseña fue comprometida...'); // Log antes de la verificación de la contraseña en filtraciones
  
    const timesCommitted = await this.pwnedservice.verificationPassword(contraseña);
  
    if (timesCommitted > 0) {
      console.log(`La contraseña fue comprometida ${timesCommitted} veces`); // Log si la contraseña fue comprometida
      throw new BadRequestException({
        message: `La contraseña ya fue comprometida ${timesCommitted} veces`,
        error: 'BadRequest',
      });
    }
  
    console.log('Hasheando contraseña...'); // Log antes del hasheo de la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10); // Hash de la contraseña

    console.log('Creando nuevo usuario...'); // Log antes de crear el nuevo usuario
    const newUser = new this.userModel({
        sessionID: sessionId,
        usuario: usuario,
        contraseña: hashedPassword,
        correo_Electronico: correo_Electronico,
    });

    console.log('Enviando correo de verificación...'); // Log antes de enviar el correo de verificación
    await this.send_email_verification(correo_Electronico);

    console.log('Guardando nuevo usuario en la base de datos...'); // Log antes de guardar el nuevo usuario
    await newUser.save();

    console.log('Registro completado exitosamente'); // Log al final del registro exitoso
    return {
        status: HttpStatus.OK,
        message: 'Gracias por registrarse, hemos enviado un link de activación de cuenta a su correo',
    };
}
  
  

  // TODO: Login de usuario
  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { usuario, contraseña } = loginDto;
  
    const sessionId = this.generateSessionID();
    const user = await this.userModel.findOne({ usuario });
  
    if (!user) {
      throw new ConflictException(
        `El usuario ${usuario} no está registrado, por favor regístrese`,
      );
    }
  
    if (!user.estado) {
      throw new ForbiddenException(
        'Estimado usuario, le solicitamos que verifique su cuenta para habilitar el acceso a nuestros servicios.',
      );
    }
  
    const userIncident = await this.incidentService.usernameIsBlocked({ usuario });
    if (userIncident && userIncident.isBlocked) {
      const bloqueExpiresAtMexico = new Date(userIncident.blockExpiresAt).toLocaleString('es-MX', {
        timeZone: 'America/Mexico_City',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
  
      throw new ForbiddenException(
        `Su cuenta ha sido bloqueada temporalmente. Podrá acceder nuevamente a las ${bloqueExpiresAtMexico}.`,
      );
    }
  
    const isPasswordMatching = await bcrypt.compare(contraseña, user.contraseña);
  
    if (!isPasswordMatching) {
      await this.incidentService.loginFailedAttempt(usuario);
      throw new ConflictException('Acceso denegado: Las credenciales incorrectas');
    }
  
    user.sessionId = sessionId;
    await user.save();
  
    const payload = { username: user.usuario, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
  
    return { token };
  }

  // TODO: Olvidar Contraseña
  async forgot_password(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    const { correo_Electronico } = forgotPasswordDto;

    const user = await this.userModel.findOne({ correo_Electronico });

    if (!user) {
      throw new BadRequestException('El correo no está registrado');
    }

    const resetToken = this.jwtService.sign({ id: user.id }, { expiresIn: '1h' });
    await this.emailService.sendPasswordResetEmail(correo_Electronico, resetToken);

    return { message: 'Se ha enviado un correo con el enlace de recuperación' };
  }

  // TODO: Restablecer Contraseña
  async reset_password(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const { token, new_password } = resetPasswordDto;

    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userModel.findById(decoded.id);

      if (!user) {
        throw new BadRequestException('Token inválido o expirado');
      }

      const hashedPassword = await bcrypt.hash(new_password, 10);
      user.contraseña = hashedPassword;

      await user.save();
      await this.revokeSessions(user.id);

      return { message: 'Contraseña actualizada exitosamente' };
    } catch (err) {
      throw new BadRequestException('Token inválido o expirado');
    }
  }

  // Enviar correo de verificación por OTP
  private async send_email_verification(email: string): Promise<any> {
    const otpCode = this.otpService.generateOTP();
    await this.emailService.send_code_verfication(otpCode, email);

    return {
      status: HttpStatus.OK,
      message: 'Se ha enviado a su correo un link de activación',
    };
  }

  // Verificación de Email
  async verify_email(activationDto: ActivationDto): Promise<any> {
    const { correo_Electronico, otp } = activationDto;

    const isValid = this.otpService.verifyOTP(otp);
    if (isValid) {
      const user = await this.userModel.findOne({ correo_Electronico });

      if (!user) {
        throw new BadRequestException('El correo no está registrado');
      }

      user.estado = true;
      await user.save();

      return { status: HttpStatus.OK, message: 'Se ha verificado con éxito la cuenta' };
    }

    throw new ConflictException({ message: 'El código es inválido', error: 'Conflict' });
  }

  // Revocación de cookies (sesiones)
  private async revokeSessions(userId: string): Promise<any> {
    await this.userModel.updateOne({ _id: userId }, { $unset: { sessionId: '' } });
    return { message: 'Todas las sesiones han sido revocadas.' };
  }

  async validateSessionjwt(req: Request): Promise<any> {
    const token = req.cookies['jwt'];

    if (!token) {
      throw new UnauthorizedException('No hay token en la cookie.');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado.');
    }
  }
}
