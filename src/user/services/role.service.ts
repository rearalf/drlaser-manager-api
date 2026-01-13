import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  PermissionGroupDto,
  RoleWithPermissionsDto,
} from '../dto/filter-role.dto';

import { RolePermission } from '../entities/role-permission.entity';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findById(
    id: number,
    withPermission: boolean = false,
  ): Promise<RoleWithPermissionsDto> {
    const query = this.roleRepository.createQueryBuilder('role');

    if (withPermission) {
      query
        .leftJoinAndSelect('role.rolePermissions', 'rolePermission')
        .leftJoinAndSelect('rolePermission.permission', 'permission')
        .leftJoinAndSelect('permission.parent', 'parentPermission')
        .where('role.id = :roleId', { roleId: id });
    } else {
      query
        .leftJoin('role.rolePermissions', 'rolePermissions')
        .leftJoin('rolePermissions.permission', 'permission')
        .select([
          'role.id',
          'role.name',
          'role.description',
          'rolePermissions.id',
          'permission.id',
        ])
        .where('role.id = :id', { id });
    }

    const role = await query.getOne();

    if (!role) throw new NotFoundException('Rol no encontrado.');

    const permissionIds =
      role.rolePermissions?.map((rp) => rp.permission?.id) || [];

    const permissionsGroup = withPermission
      ? this.buildPermissionGroups(role.rolePermissions)
      : [];

    return {
      id: role.id,
      name: role.name,
      description: role.description,
      permission: permissionIds,
      permissionsGroup,
    };
  }

  private buildPermissionGroups(
    rolePermissions: RolePermission[] = [],
  ): PermissionGroupDto[] {
    const groupsMap = new Map<number, PermissionGroupDto>();

    for (const rp of rolePermissions) {
      const perm = rp.permission;
      if (!perm) continue;

      const parent = perm.parent;

      if (parent) {
        if (!groupsMap.has(parent.id)) {
          groupsMap.set(parent.id, {
            id: parent.id,
            name: parent.name,
            label: parent.label,
            description: parent.description,
            children: [],
          });
        }

        const parentGroup = groupsMap.get(parent.id)!;
        if (!parentGroup.children.some((c) => c.id === perm.id)) {
          parentGroup.children.push({
            id: perm.id,
            name: perm.name,
            label: perm.label,
            description: perm.description,
          });
        }
      } else {
        if (!groupsMap.has(perm.id)) {
          groupsMap.set(perm.id, {
            id: perm.id,
            name: perm.name,
            label: perm.label,
            description: perm.description,
            children: [],
          });
        }
      }
    }

    return Array.from(groupsMap.values());
  }
}
