import { BadRequestException, Injectable } from '@nestjs/common';
import { Brackets, DataSource, EntityManager, Repository } from 'typeorm';

import { PersonService } from '@/person/services/person.service';
import { DoctorSpecialtyService } from './doctor-specialty.service';
import { UserService } from '@/user/services/user.service';
import { SpecialtyService } from './specialty.service';

import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { FilterDoctorDto } from '../dto/filter-doctor.dto';
import { PersonTypeId } from '@/common/enums/person-type';

import { Doctor } from '../entities/doctor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationHelper } from '@/common/helpers/pagination-helper';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly personService: PersonService,
    private readonly specialtyService: SpecialtyService,
    private readonly doctorSpecialtyService: DoctorSpecialtyService,
  ) {}

  async findAll(filterDoctorDto: FilterDoctorDto): Promise<void> {
    const { search, pagination, page, per_page } = filterDoctorDto;

    const queryBuilder = this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.person', 'person')
      .leftJoinAndSelect('person.user', 'user')
      .leftJoinAndSelect('doctor.primarySpecialty', 'Specialty')
      .leftJoinAndSelect('doctor.doctorSpecialties', 'doctorSpecialties')
      .leftJoinAndSelect('doctorSpecialties.specialty', 'specialty');

    if (typeof search === 'string' && search.trim()) {
      const searchNormalized = search.trim();
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('unaccent(person.first_name) ILIKE :filtro', {
            filtro: `%${searchNormalized}%`,
          })
            .orWhere('unaccent(person.middle_name) ILIKE :filtro', {
              filtro: `%${searchNormalized}%`,
            })
            .orWhere('unaccent(person.last_name) ILIKE :filtro', {
              filtro: `%${searchNormalized}%`,
            })
            .orWhere('unaccent(user.email) ILIKE :filtro', {
              filtro: `%${searchNormalized}%`,
            });
        }),
      );
    }

    if (pagination) PaginationHelper.paginate(queryBuilder, page, per_page);

    const [_doctors, _total] = await queryBuilder.getManyAndCount();

    // console.log({ doctors, total });
  }

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
