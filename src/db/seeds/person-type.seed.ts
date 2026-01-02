import { DataSource, EntityManager } from 'typeorm';

import { PersonType } from '@/person/entities/person-type.entity';

import { personTypeSeeds } from './seeder-values';
import { Seeder } from './seeder';

export class PersonTypeSeed extends Seeder {
  constructor(readonly dataSource: DataSource) {
    super(dataSource);
  }

  async run(manager: EntityManager): Promise<void> {
    await manager
      .createQueryBuilder()
      .insert()
      .into(PersonType)
      .values([...personTypeSeeds])
      .execute();
  }
}
