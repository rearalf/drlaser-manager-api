import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';

import { CreatePatientDto } from '../dto/create-patient.dto';
// import { Patient } from '../entities/patient.entity';

@Controller('patient')
export class PatientController {
  //   constructor(private readonly patientService: PatientService) {}

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
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body() _createPatientDto: CreatePatientDto,
    @UploadedFile() _file?: File,
  ): Promise<void> {
    // return await this.patientService.create(createPatientDto);
  }
}
