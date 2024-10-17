import { Prop } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
  @Prop({ required: true})
  @IsEmail({}, { message: "Por favor, ingrese un correo valido" })  
  email: string;

  @Prop({ required: true })
  @IsNotEmpty({ message: "Por favor, ingrese su contraseña "})
  password: string;
}


export class SendEmailVerificationDto {
  @Prop({ required: true })
  @IsEmail({}, { message: "Por favor, proporciona un correo valido" })
  email: string;
}