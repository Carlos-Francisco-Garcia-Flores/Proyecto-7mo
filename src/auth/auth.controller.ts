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
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService 
  ) {}


    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
      const { token } = await this.authService.login(loginDto);
  
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax', 
        maxAge: 3600000,
        path: '/',
      });
  
      return {
        status: HttpStatus.OK,
        message: 'Sesión iniciada exitosamente',
      };
    }
  
  @Get('validate-user')
  async validateSession(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['auth_token'];
    console.log (req.cookies);
    if (!token) {
      throw new UnauthorizedException('No hay token en la cookie.');
    }

    try {
      // Verificar el token en la cookie
      const decoded = this.jwtService.verify(token);
      return res.status(200).json({ message: 'Sesión válida', role: decoded.role });
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado.');
    }
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.cookie('auth_token', '', { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'none', 
      expires: new Date(0), // Expira inmediatamente
    });
    return res.status(200).json({ message: 'Sesión cerrada exitosamente' });
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
