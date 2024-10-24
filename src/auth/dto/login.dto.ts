    import { Prop } from "@nestjs/mongoose";
import { IsNotEmpty } from "class-validator";

export class LoginDto {
    @Prop({ required: true })
    @IsNotEmpty({ message: "Por favor, ingrese su nombre de usuario" })
    usuario: string;

    @Prop({ required: true })
    @IsNotEmpty({ message: "Por favor, ingrese su contraseña "})
    contraseña: string;

    @Prop({ required: true })
    @IsNotEmpty({ message: "Por favor, ingrese el tipo de usuario "})
    role: string;
}