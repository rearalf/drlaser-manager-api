import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { PersonContactService } from './person-contact.service';
import { PersonTypeService } from './person-type.service';

import { PersonContact } from '../entities/person-contact.entity';
import { Person } from '../entities/person.entity';

import { CreatePersonDto } from '../dto/create-person.dto';

@Injectable()
export class PersonService {
  constructor(
    private readonly personTypeService: PersonTypeService,
    private readonly personContactService: PersonContactService,
  ) {}

  async createWithEnetity(
    manager: EntityManager,
    createPersonDto: CreatePersonDto,
  ): Promise<Person> {
    await this.personTypeService.findById(createPersonDto.person_type_id);

    const createPerson = manager.create(Person, {
      first_name: createPersonDto.first_name,
      middle_name: createPersonDto.middle_name,
      last_name: createPersonDto.last_name,
      person_type_id: createPersonDto.person_type_id,
      user_id: createPersonDto.user_id,
    });

    const savedPerson = await manager.save(Person, createPerson);

    const contacts: PersonContact[] = [];

    if (createPersonDto.personContact) {
      const savedContacts = await this.personContactService.create(
        manager,
        savedPerson.id,
        createPersonDto.personContact,
      );

      contacts.push(...savedContacts);
    }

    return {
      ...savedPerson,
      contacts,
    };
  }
}
