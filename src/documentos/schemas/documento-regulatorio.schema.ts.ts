import { Schema, Document, model } from 'mongoose';

export interface DocumentoRegulatorio extends Document {
  tipo: string;            // Tipo del documento (ej: Política de privacidad, Términos y condiciones)
  descripcion: string;      // Contenido o descripción del documento
  version: string;          // Versión del documento (ej: 1.0, 1.1)
  fechaInicio: Date;
  fechaCreacion: Date; 
  fechaFin: Date ;           // Fecha de creación
  vigente: boolean;         // Si el documento está vigente o no
  eliminado: boolean;       // Si el documento está eliminado (eliminación lógica)
}

export const DocumentoRegulatorioSchema = new Schema({
  tipo: { type: String, required: true },
  descripcion: { type: String, required: true },
  version: { type: String, required: true, default: '1.0' },
  fechaCreacion: { type: Date, default: Date.now },
  fechaInicio: { type: Date, required: true },  // Asegúrate de que esté correctamente definido
  fechaFin: { type: Date },  // Define fechaFin como opcional
  vigente: { type: Boolean, default: true },
  eliminado: { type: Boolean, default: false },
});

export const DocumentoRegulatorioModel = model<DocumentoRegulatorio>('DocumentoRegulatorio', DocumentoRegulatorioSchema);
