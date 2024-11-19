import { IsOptional, IsString, IsNumber, IsUrl } from 'class-validator';

export class UpdatePerfilDto {
  @IsOptional()
  @IsUrl()
  logo?: string;

  @IsOptional()
  @IsString()
  eslogan?: string;

  @IsOptional()
  @IsString()
  mision?: string;

  @IsOptional()
  @IsString()
  vision?: string;
}
