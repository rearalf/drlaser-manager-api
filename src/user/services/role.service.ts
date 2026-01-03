import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleWithPermissionsDto } from '../dto/filter-role.dto';

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
    let role: Role | null;

    if (withPermission) {
      role = await this.roleRepository
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.rolePermissions', 'rolePermission')
        .leftJoinAndSelect('rolePermission.permission', 'permission')
        .leftJoinAndSelect('permission.parent', 'parentPermission')
        .where('role.id = :roleId', { roleId: id })
        .getOne();
    } else {
      role = await this.roleRepository
        .createQueryBuilder('role')
        .leftJoin('role.rolePermissions', 'rolePermissions')
        .leftJoin('rolePermissions.permission', 'permission')
        .select([
          'role.id',
          'role.name',
          'role.description',
          'role_permission.id',
          'permission.id',
        ])
        .where('role.id = :id', { id })
        .getOne();
    }

    if (!role) throw new NotFoundException('Rol no encontrado.');

    let permissionsGroup: {
      id: number;
      name: string;
      label: string;
      description: string;
      children: {
        id: number;
        name: string;
        label: string;
        description: string;
      }[];
    }[] = [];

    let permissionIds: number[] = [];

    if (withPermission) {
      const grouped: typeof permissionsGroup = [];

      for (const rp of role.rolePermissions ?? []) {
        const perm = rp.permission;
        const parent = perm.parent;

        if (parent) {
          let parentGroup = grouped.find((g) => g.id === parent.id);
          if (!parentGroup) {
            parentGroup = {
              id: parent.id,
              name: parent.name,
              label: parent.label,
              description: parent.description,
              children: [],
            };
            grouped.push(parentGroup);
          }

          if (!parentGroup.children.some((c) => c.id === perm.id)) {
            parentGroup.children.push({
              id: perm.id,
              name: perm.name,
              label: perm.label,
              description: perm.description,
            });
          }
        } else {
          const existing = grouped.find((g) => g.id === perm.id);
          if (!existing) {
            grouped.push({
              id: perm.id,
              name: perm.name,
              label: perm.label,
              description: perm.description,
              children: [],
            });
          }
        }
      }

      permissionsGroup = grouped;
    }

    permissionIds = role.rolePermissions.map((rp) => rp.permission.id);

    return {
      id: role.id,
      name: role.name,
      description: role.description,
      permission: permissionIds,
      permissionsGroup,
    };
  }
}
