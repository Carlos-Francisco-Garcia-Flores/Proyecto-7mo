import { Prop } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @Prop({ required: true})
  @IsEmail({}, { message: "Por favor, ingrese un correo valido" })  
  email: string;

  @Prop({ required: true })
  @IsNotEmpty({ message: "Por favor, ingrese su contraseña"})
  @MinLength(8, { message: "La contraseña debe tener al menos 6 caracteres"})
  password: string;
}
