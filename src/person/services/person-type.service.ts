import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { PersonType } from '../entities/person-type.entity';

@Injectable()
export class PersonTypeService {
  constructor(
    @InjectRepository(PersonType)
    private readonly personTypeRepository: Repository<PersonType>,
  ) {}

  async findAll(): Promise<PersonType[]> {
    const personType = await this.personTypeRepository
      .createQueryBuilder('personType')
      .select(['personType.id', 'personType.name'])
      .getMany();

    return personType;
  }

  async findById(id: number): Promise<PersonType | null> {
    const personType = await this.personTypeRepository
      .createQueryBuilder('personType')
      .select(['personType.id', 'personType.name', 'personType.description'])
      .where('personType.id = :id', { id })
      .getOne();

    return personType;
  }
}
