import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IncidentSchema } from './schemas/incident.schema';
import { IncidentController } from './incident.controller';
import { IncidentService } from './incident.service';
import { AuthModule } from '../auth/auth.module';  

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Incident', schema: IncidentSchema }]), AuthModule],
  controllers: [IncidentController],
  providers: [IncidentService],
  exports: [IncidentService]
})
export class IncidentModule {}  