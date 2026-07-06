import { Brackets, DataSource, EntityManager, Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Response } from 'express';

import { PersonService } from '@/person/services/person.service';
import { DoctorSpecialtyService } from './doctor-specialty.service';
import { UserService } from '@/user/services/user.service';
import { SpecialtyService } from './specialty.service';

import {
  IDoctorByIdResponse,
  IDoctorListItemResponse,
} from '../dto/find-all-doctor-response.interface';
import { DoctorListItemResponseDto } from '../dto/find-all-doctor-response.dto';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { FilterDoctorDto } from '../dto/filter-doctor.dto';

import { PaginationHelper, PersonTypeId } from '@/common';
import { Doctor } from '../entities/doctor.entity';

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

  async findAll(
    filterDoctorDto: FilterDoctorDto,
    res: Response,
  ): Promise<DoctorListItemResponseDto[]> {
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

    const [doctors, count] = await queryBuilder.getManyAndCount();

    if (filterDoctorDto.pagination) {
      PaginationHelper.setHeaders(res, count, filterDoctorDto);
    }

    const data: IDoctorListItemResponse[] = doctors.map((doctor) => ({
      id: doctor.id,
      specialty_id: doctor.specialty_id,
      qualification: doctor.qualification ?? null,
      primarySpecialty: {
        id: doctor.primarySpecialty.id,
        name: doctor.primarySpecialty.name,
        description: doctor.primarySpecialty.description ?? null,
      },
      // person
      person_id: doctor.person.id,
      full_name:
        `${doctor.person.first_name ?? ''} ${doctor.person.middle_name ?? ''} ${doctor.person.last_name ?? ''}`.trim(),
      profile_picture_url: doctor.person.profile_picture_url ?? null,
      profile_picture_name: doctor.person.profile_picture_name ?? null,
      // user
      email: doctor.person.user ? doctor.person.user.email : null,
      user_id: doctor.person.user ? doctor.person.user.id : null,
    }));

    return data;
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

  async getDoctorById(doctor_id: number): Promise<IDoctorByIdResponse> {
    const doctor = await this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.person', 'person')
      .leftJoinAndSelect('person.user', 'user')
      .leftJoinAndSelect('user.userRoles', 'userRoles')
      .leftJoinAndSelect('userRoles.role', 'role')
      .leftJoinAndSelect('user.userPermission', 'userPermission')
      .leftJoinAndSelect('userPermission.permission', 'permission')
      .leftJoinAndSelect('doctor.primarySpecialty', 'primarySpecialty')
      .leftJoinAndSelect('doctor.doctorSpecialties', 'doctorSpecialties')
      .leftJoinAndSelect('doctorSpecialties.specialty', 'specialty')
      .where('doctor.id = :id', { id: doctor_id })
      .getOne();

    if (!doctor) throw new NotFoundException('Doctor no encontrado.');

    return {
      id: doctor.id,
      person_id: doctor.person_id,
      specialty_id: doctor.specialty_id,
      qualification: doctor.qualification ?? null,
      created_at: doctor.created_at,
      person: {
        id: doctor.person.id,
        first_name: doctor.person.first_name,
        middle_name: doctor.person.middle_name ?? null,
        last_name: doctor.person.last_name,
        profile_picture_name: doctor.person.profile_picture_name ?? null,
        profile_picture_url: doctor.person.profile_picture_url ?? null,
        user_id: doctor.person.user_id ?? null,
        person_type_id: doctor.person.person_type_id,
        created_at: doctor.person.created_at,
        user: doctor.person.user
          ? {
              id: doctor.person.user.id,
              email: doctor.person.user.email,
              created_at: doctor.person.user.created_at,
            }
          : null,
      },
      primarySpecialty: {
        id: doctor.primarySpecialty.id,
        name: doctor.primarySpecialty.name,
        description: doctor.primarySpecialty.description ?? null,
      },
      doctorSpecialties:
        doctor.doctorSpecialties?.map((doctorSpecialty) => ({
          id: doctorSpecialty.id,
          doctor_id: doctorSpecialty.doctor_id,
          specialty_id: doctorSpecialty.specialty_id,
          created_at: doctorSpecialty.created_at,
          specialty: {
            id: doctorSpecialty.specialty.id,
            name: doctorSpecialty.specialty.name,
            description: doctorSpecialty.specialty.description ?? null,
          },
        })) ?? [],
    };
  }
}
