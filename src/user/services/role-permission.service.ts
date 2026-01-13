import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { RolePermission } from '../entities/role-permission.entity';

@Injectable()
export class RolePermissionService {
  async createMany(
    entityManager: EntityManager,
    role_id: number,
    permission_ids: number[],
  ): Promise<RolePermission[]> {
    if (!permission_ids || permission_ids.length === 0) return [];

    const uniqueIds = [...new Set(permission_ids)];

    const payload = uniqueIds.map((permission_id) => ({
      role_id,
      permission_id,
    }));

    const result = await entityManager
      .createQueryBuilder()
      .insert()
      .into(RolePermission)
      .values(payload)
      .orIgnore()
      .returning('*')
      .execute();

    const createdPermissions = entityManager.create(
      RolePermission,
      result.generatedMaps,
    );

    return createdPermissions;
  }

  async restoreRolePermission(
    entityManager: EntityManager,
    role_id: number,
    newPermissionIds: number[],
  ): Promise<void> {
    const repo = entityManager.getRepository(RolePermission);

    const allRolePermissions = await repo.find({
      where: { role_id },
      withDeleted: true,
    });

    const toRestore: number[] = [];
    const toInsert: number[] = [];

    for (const permission_id of newPermissionIds) {
      const existing = allRolePermissions.find(
        (rp) => rp.permission_id === permission_id,
      );

      if (existing) {
        if (existing.deleted_at) toRestore.push(permission_id);
      } else {
        toInsert.push(permission_id);
      }
    }

    const currentActive = allRolePermissions.filter((rp) => !rp.deleted_at);
    const toDelete = currentActive
      .filter((rp) => !newPermissionIds.includes(rp.permission_id))
      .map((rp) => rp.permission_id);

    if (toDelete.length > 0) {
      await repo
        .createQueryBuilder()
        .softDelete()
        .where('role_id = :role_id', { role_id })
        .andWhere('permission_id IN (:...toDelete)', { toDelete })
        .execute();
    }

    if (toRestore.length > 0) {
      for (const permission_id of toRestore) {
        await repo
          .createQueryBuilder('role_permission')
          .restore()
          .where('role_permission.role_id = :role_id', { role_id })
          .andWhere('role_permission.permission_id = :permission_id', {
            permission_id,
          })
          .execute();
      }
    }

    if (toInsert.length > 0) {
      await this.createMany(entityManager, role_id, toInsert);
    }
  }

  async softDeleteMulti(
    entityManager: EntityManager,
    role_id: number,
  ): Promise<number> {
    const repo = entityManager.getRepository(RolePermission);

    const allRolePermissions = await repo.find({
      where: { role_id },
    });

    if (allRolePermissions.length > 0) {
      const ids = allRolePermissions.map((rp) => rp.id);
      const result = await repo.softDelete(ids);
      return result.affected || 0;
    }

    return 0;
  }
}
