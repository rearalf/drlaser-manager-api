import { Specialty } from '@/doctor/entities/specialty.entity';
import { DataSource, EntityManager } from 'typeorm';

import { specialtiesSeeds } from './specialties.values';
import { Seeder } from '../seeder';

export class SpecialtySeed extends Seeder {
  constructor(readonly dataSource: DataSource) {
    super(dataSource);
  }

  async run(manager: EntityManager): Promise<void> {
    await manager
      .createQueryBuilder()
      .insert()
      .into(Specialty)
      .values([...specialtiesSeeds])
      .execute();
  }
}
