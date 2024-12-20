import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IncidentDocument = Incident & Document;

@Schema()
export class Incident {
  @Prop({ required: true })
  usuario: string;

  @Prop({ default: 0 })
  failedAttempts: number;

  @Prop({ default: 0 })
  totalFailedAttempts: number; 

  @Prop()
  lastAttempt: Date;

  @Prop({ default: "open" })
  state: string;

  @Prop({ default: false })
  isBlocked: boolean

  @Prop({ default: null })
  blockExpiresAt: Date; 



}

export const IncidentSchema = SchemaFactory.createForClass(Incident).set('versionKey', false);