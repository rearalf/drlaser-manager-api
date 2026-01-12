import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

import { PersonService } from '@/person/services/person.service';
import { UserService } from '@/user/services/user.service';
import { SpecialtyService } from './specialty.service';

import { CreateDoctorDto } from '../dto/create-doctor.dto';

import { Doctor } from '../entities/doctor.entity';
import { DoctorSpecialtyService } from './doctor-specialty.service';
import { PersonTypeId } from '@/common/enums/person-type';

@Injectable()
export class DoctorService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly personService: PersonService,
    private readonly specialtyService: SpecialtyService,
    private readonly doctorSpecialtyService: DoctorSpecialtyService,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    createDoctorDto.person_type_id = PersonTypeId.DOCTOR;

    if (
      createDoctorDto.specialty_ids &&
      createDoctorDto.specialty_ids.includes(createDoctorDto.specialty_id)
    ) {
      throw new BadRequestException(
        'La especialidad principal no puede repetirse como secundaria.',
      );
    }

    return await this.dataSource.transaction(async (manager: EntityManager) => {
      const allSpecialtyIds = [
        createDoctorDto.specialty_id,
        ...(createDoctorDto.specialty_ids ?? []),
      ];

      await this.specialtyService.validateIds(manager, allSpecialtyIds);

      const newUser = await this.userService.createWithEntity(manager, {
        email: createDoctorDto.email,
        password: createDoctorDto.password,
        role_ids: createDoctorDto.role_ids,
      });

      const person = await this.personService.createWithEnetity(manager, {
        first_name: createDoctorDto.first_name,
        last_name: createDoctorDto.last_name,
        middle_name: createDoctorDto.middle_name,
        person_type_id: createDoctorDto.person_type_id,
        user_id: newUser.id,
        profile_picture: createDoctorDto.profile_picture,
        profile_picture_name: createDoctorDto.profile_picture_name,
      });

      const createDoctor = manager.create(Doctor, {
        qualification: createDoctorDto.qualification,
        specialty_id: createDoctorDto.specialty_id,
        person_id: person.id,
      });

      const newDoctor = await manager.save(Doctor, createDoctor);

      if (createDoctorDto.specialty_ids)
        await this.doctorSpecialtyService.create(
          manager,
          newDoctor.id,
          createDoctorDto.specialty_ids,
        );

      return newDoctor;
    });
  }
}
