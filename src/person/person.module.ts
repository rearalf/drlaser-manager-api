import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { PersonContact } from './entities/person-contact.entity';
import { PersonType } from './entities/person-type.entity';
import { Person } from './entities/person.entity';

import { PersonContactService } from './services/person-contact.service';
import { PersonTypeService } from './services/person-type.service';
import { PersonService } from './services/person.service';

@Module({
  imports: [TypeOrmModule.forFeature([PersonType, PersonContact, Person])],
  providers: [PersonService, PersonTypeService, PersonContactService],
  exports: [PersonService],
})
export class PersonModule {}
