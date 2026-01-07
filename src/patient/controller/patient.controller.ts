import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';
import {
  UseInterceptors,
  UploadedFiles,
  Controller,
  Post,
  Body,
} from '@nestjs/common';

import { PatientService } from '../services/patient.service';

import { CreatePatientDto } from '../dto/create-patient.dto';

import { Patient } from '../entities/patient.entity';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a patient',
    description:
      'Creates a new patient, person, person type, contacts, user and role',
  })
  @ApiCreatedResponse({
    description: 'The patient has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Validation failed or bad request.' })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'profile_picture', maxCount: 1 }], {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async create(
    @Body() createPatientDto: CreatePatientDto,
    @UploadedFiles() files?: { profile_picture?: Express.Multer.File[] },
  ): Promise<Patient> {
    if (files?.profile_picture?.[0]) {
      createPatientDto.profile_picture = files.profile_picture[0];

      createPatientDto.profile_picture_name =
        files.profile_picture[0].originalname;
    }
    return await this.patientService.create(createPatientDto);
  }
}
