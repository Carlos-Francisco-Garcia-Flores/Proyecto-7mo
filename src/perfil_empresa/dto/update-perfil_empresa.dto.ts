import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePerfilEmpresaDto {
  @IsString()
  @IsNotEmpty()
  eslogan: string;

  @IsString()
  @IsNotEmpty()
  mision: string;

  @IsString()
  @IsNotEmpty()
  vision: string;
}
