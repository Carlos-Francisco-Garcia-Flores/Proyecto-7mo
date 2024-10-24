export class CrearDocumentoDto {
  tipo: string;
  descripcion: string;
  fechaInicio: Date;  // Fecha de inicio de la vigencia
  fechaFin?: Date;  // Fecha de fin
}


// modificar-documento.dto.ts
export class ModificarDocumentoDto {
  descripcion: string;
  fechaFin?: Date;  // Fecha para terminar la vigencia
}
