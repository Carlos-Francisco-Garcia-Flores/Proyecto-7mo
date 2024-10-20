import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ default: ''})
  sessionId: string;

  @Prop({ required: true })
  @IsNotEmpty({ message: "Por favor, ingrese su nombre de usuario"})
  @MinLength(6, { message: "El nombre de usuario debe tener al menos un total de  6 caracteres" })
  @MaxLength(12, { message: "El nombre de usuario debe tener como maximo un total de 12 caracteres" })
  usuario: string;

  @Prop({ required: true })
  @IsNotEmpty({ message: "Por favor, ingrese su contraseña"})
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres"})
  contraseña: string;

  @Prop({ required: true})
  @IsEmail({}, { message: "Por favor, ingrese un correo valido" })  
  correo_Electronico: string;

  @Prop({ default: false })
  estado: boolean;

  @Prop({ default: 'user'})
  role: string
}

export const UserSchema = SchemaFactory.createForClass(User).set('versionKey', false);
  