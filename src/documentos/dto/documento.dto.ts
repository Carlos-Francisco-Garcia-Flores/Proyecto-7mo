import { IsString, IsDate, IsOptional } from 'class-validator';

export class CreateDocumentoDto {
  @IsString()
  tipo: string;

  @IsString()
  descripcion: string;

  @IsOptional()
  @IsDate()
  fechaInicio: Date;

  @IsOptional()
  @IsDate()
  fechaFin: Date;
}

export class UpdateDocumentoDto {
  @IsString()
  descripcion: string;

}