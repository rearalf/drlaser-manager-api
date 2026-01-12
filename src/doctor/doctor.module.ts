import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { DoctorController } from './controller/doctor.controller';

import { DoctorSpecialtyService } from './services/doctor-specialty.service';
import { SpecialtyService } from './services/specialty.service';
import { DoctorService } from './services/doctor.service';

import { PersonModule } from '@/person/person.module';
import { UserModule } from '@/user/user.module';

import { Doctor } from './entities/doctor.entity';

@Module({
  controllers: [DoctorController],
  providers: [DoctorService, DoctorSpecialtyService, SpecialtyService],
  imports: [TypeOrmModule.forFeature([Doctor]), PersonModule, UserModule],
})
export class DoctorModule {}
