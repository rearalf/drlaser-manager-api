import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { PersonModule } from '@/person/person.module';
import { UserModule } from '@/user/user.module';

import { Patient } from './entities/patient.entity';

import { PatientController } from './controller/patient.controller';
import { PatientService } from './services/patient.service';

@Module({
  imports: [TypeOrmModule.forFeature([Patient]), PersonModule, UserModule],
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule {}
