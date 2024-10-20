import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUsuarioDto {


  @IsEmail()
  @IsNotEmpty()
  correo_Electronico: string;

  
  @IsString()
  @IsNotEmpty()
  contraseña: string;

  @IsString()
  @IsNotEmpty()
  usuario: string;

  @IsString()
  @IsNotEmpty()
  tipo_Usuario: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

}
