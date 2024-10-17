import { IsString, IsNotEmpty } from 'class-validator';

export class CreateInformacionDto {
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;
}
