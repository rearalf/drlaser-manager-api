import { DataSource, EntityManager, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Patient } from '../entities/patient.entity';
import { User } from '@/user/entities/user.entity';

import { PersonService } from '@/person/services/person.service';
import { UserService } from '@/user/services/user.service';

import { CreatePatientDto } from '../dto/create-patient.dto';

@Injectable()
export class PatientService {
  private readonly logger = new Logger(PatientService.name);

  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly personService: PersonService,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    createPatientDto.person_type_id = 5;

    return await this.dataSource.transaction(async (manager: EntityManager) => {
      let newUser: User | null = null;
      if (createPatientDto.email && createPatientDto.password) {
        newUser = await this.userService.createWithEntity(manager, {
          email: createPatientDto.email,
          password: createPatientDto.password,
          role_ids: createPatientDto.role_ids || [2],
        });
      }

      const person = await this.personService.createWithEnetity(manager, {
        first_name: createPatientDto.first_name,
        last_name: createPatientDto.last_name,
        middle_name: createPatientDto.middle_name,
        person_type_id: createPatientDto.person_type_id,
        user_id: newUser ? newUser.id : undefined,
        personContact: createPatientDto.person_contacts,
        profile_picture: createPatientDto.profile_picture,
        profile_picture_name: createPatientDto.profile_picture_name,
      });

      const createPatient = manager.create(Patient, {
        birth_date: createPatientDto.birth_date,
        address: createPatientDto.address,
        phone: createPatientDto.phone,
        allergic_reactions: createPatientDto.allergic_reactions,
        medical_history: createPatientDto.medical_history,
        complete_odontogram: createPatientDto.complete_odontogram,
        current_systemic_treatment: createPatientDto.current_systemic_treatment,
        gender: createPatientDto.gender,
        lab_results: createPatientDto.lab_results,
        occupation: createPatientDto.occupation,
        has_se_issues: createPatientDto.has_se_issues,
        has_sgi_issues: createPatientDto.has_sgi_issues,
        has_sgu_issues: createPatientDto.has_sgu_issues,
        has_sr_issues: createPatientDto.has_sr_issues,
        has_sme_issues: createPatientDto.has_sme_issues,
        has_snc_issues: createPatientDto.has_snc_issues,
        has_su_issues: createPatientDto.has_su_issues,
        has_svc_issues: createPatientDto.has_svc_issues,
        system_evaluation_notes: createPatientDto.system_evaluation_notes,
        person_id: person.id,
      });

      const newPatient = await manager.save(Patient, createPatient);

      return {
        ...newPatient,
      };
    });
  }
}
