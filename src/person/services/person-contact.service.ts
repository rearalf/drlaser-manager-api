import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { PersonContact } from '../entities/person-contact.entity';

import { CreatePersonContactDto } from '../dto/create-person-contact.dto';

@Injectable()
export class PersonContactService {
  constructor(
    @InjectRepository(PersonContact)
    private readonly personContactRepository: Repository<PersonContact>,
  ) {}

  async create(
    manager: EntityManager,
    person_id: number,
    createPersonContactDtos: CreatePersonContactDto[],
  ): Promise<PersonContact[]> {
    const contacts: PersonContact[] = [];

    for (const dto of createPersonContactDtos) {
      const createContact = manager.create(PersonContact, {
        contact_type: dto.contact_type,
        contact_value: dto.contact_value,
        person_id: person_id,
      });

      contacts.push(createContact);
    }

    const savedContacts = await manager.save(PersonContact, contacts);

    return savedContacts;
  }
}
