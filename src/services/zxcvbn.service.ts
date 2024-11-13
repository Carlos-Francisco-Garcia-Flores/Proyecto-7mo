import { Injectable, BadRequestException } from '@nestjs/common';
const zxcvbn = require('zxcvbn');

@Injectable()
export class ZxcvbnService {
  validatePassword(password: string): any {
    try {
      const result = zxcvbn(password);
      console.log('Resultado de zxcvbn:', result);

      // Si la puntuación es menor a 2, consideramos la contraseña débil
      if (result.score < 2) {
        return result;
      }

      // Retornamos null si la contraseña es fuerte (score >= 3)
      return null;
    } catch (error) {
      console.error('Error en zxcvbn:', error);
      throw new BadRequestException('Error al verificar la contraseña');
    }
  }
}
