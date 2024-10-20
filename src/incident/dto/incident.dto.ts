import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterIncidentDto {
  @IsString()
  @IsNotEmpty()
  usuario: string;
}

export class CloseIncidentDto {
  @IsString()
  @IsNotEmpty()
  usuario: string;
}

export class UsernameIsBlockedDto {
  @IsString()
  @IsNotEmpty()
  usuario: string;
}