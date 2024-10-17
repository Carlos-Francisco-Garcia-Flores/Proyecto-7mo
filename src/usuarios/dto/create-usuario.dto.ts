import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido_Paterno: string;

  @IsString()
  @IsNotEmpty()
  apellido_Materno: string;

  @IsEmail()
  @IsNotEmpty()
  correo_Electronico: string;

  @IsString()
  @IsNotEmpty()
  numero_Telefonico: string;

  @IsString()
  @IsNotEmpty()
  contraseña: string;

  @IsString()
  @IsNotEmpty()
  sexo: string;

  @IsString()
  @IsNotEmpty()
  tipo_Usuario: string;
}
