import { Body, Controller, Post, Res, HttpStatus,  Get, Req, UnauthorizedException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/resetPassword.dto';
import { RegisterDto, ActivationDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly jwtService: JwtService ) {}


  @Get('user')
  getUser(@Req() req: Request) {
    const authToken = req.cookies['auth_token'];
    if (!authToken) {
      throw new UnauthorizedException('No hay token de autenticación');
    }

    try {
      const decodedToken = this.jwtService.verify(authToken);
      return {
        username: decodedToken.username,
        role: decodedToken.role,
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }


  
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { token } = await this.authService.login(loginDto);

    // Configurar la cookie con el token
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 3600000,  // 1 hora
    });

    return {
      status: HttpStatus.OK,
      message: 'Sesión iniciada exitosamente',
    };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('forgot/password')
  async forgot_password(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgot_password(forgotPasswordDto);
  }

  @Post('reset/password')
  async reset_password(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.reset_password(resetPasswordDto);
  }

  @Post('verify/otp/code')
  async verify_email(@Body() activationDto: ActivationDto) {
    return await this.authService.verify_email(activationDto);
  }

}
