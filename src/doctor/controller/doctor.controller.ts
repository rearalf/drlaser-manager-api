import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Response } from 'express';
import {
  Res,
  Get,
  Body,
  Post,
  Query,
  Controller,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { DoctorService } from '../services/doctor.service';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { FilterDoctorDto } from '../dto/filter-doctor.dto';
import { DoctorListItemResponseDto } from '../dto/find-all-doctor-response.dto';
import { Doctor } from '../entities/doctor.entity';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  @ApiOperation({ summary: 'List all roles with pagination and search' })
  @ApiOkResponse({
    description: 'List of roles retrieved successfully.',
    type: DoctorListItemResponseDto,
    isArray: true,
  })
  async findAll(
    @Query() filterDoctorDto: FilterDoctorDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DoctorListItemResponseDto[]> {
    return await this.doctorService.findAll(filterDoctorDto, res);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a doctor',
    description:
      'Creates a new doctor, person, person type, contacts, user and role',
  })
  @ApiCreatedResponse({
    description: 'The doctor has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Validation failed or bad request.' })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'profile_picture', maxCount: 1 }], {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async create(
    @Body() createDoctorDto: CreateDoctorDto,
    @UploadedFiles() files?: { profile_picture?: Express.Multer.File[] },
  ): Promise<Doctor> {
    if (files?.profile_picture?.[0]) {
      createDoctorDto.profile_picture = files.profile_picture[0];

      createDoctorDto.profile_picture_name =
        files.profile_picture[0].originalname;
    }
    return await this.doctorService.create(createDoctorDto);
  }
}
