import { DataSource, EntityManager } from 'typeorm';

import { Permission } from '@/user/entities/permission.entity';
import { permissionSeeds } from './seeder-values';
import { Seeder } from './seeder';

export class PermissionSeed extends Seeder {
  constructor(readonly dataSource: DataSource) {
    super(dataSource);
  }

  async run(manager: EntityManager): Promise<void> {
    const permissionRepo = manager.getRepository(Permission);

    for (const seed of permissionSeeds) {
      const permission = new Permission();
      permission.id = seed.id;
      permission.name = seed.name;
      permission.description = seed.description;
      permission.label = seed.label;

      if (seed.parentId) {
        permission.parent = await permissionRepo.findOneByOrFail({
          id: seed.parentId,
        });
      }

      await permissionRepo.save(permission);
    }
  }
}
