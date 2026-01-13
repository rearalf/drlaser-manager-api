import { Brackets, DataSource, EntityManager, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { RoleListItemDto } from '../dto/role-list-item.dto';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import {
  FilterRoleDto,
  PermissionGroupDto,
  RoleWithPermissionsDto,
} from '../dto/filter-role.dto';

import { RolePermission } from '../entities/role-permission.entity';
import { Role } from '../entities/role.entity';

import { PaginationHelper } from '@/common/helpers/pagination-helper';

import { RolePermissionService } from './role-permission.service';
import { PermissionService } from './permission.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly permissionService: PermissionService,
    private readonly rolePermissionService: RolePermissionService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    filterRoleDto: FilterRoleDto,
  ): Promise<{ data: RoleListItemDto[]; total: number }> {
    const { search, pagination, page, per_page } = filterRoleDto;

    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.rolePermissions', 'rolePermission')
      .leftJoinAndSelect('rolePermission.permission', 'permission')
      .where('role.name != :excluded', { excluded: 'SuperAdmin' });

    if (search) {
      const cleanSearch = search.trim();
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('unaccent(role.name) ILIKE unaccent(:search)', {
            search: `%${cleanSearch}%`,
          });
        }),
      );
    }

    if (pagination) {
      PaginationHelper.paginate(queryBuilder, page, per_page);
    }

    const [roles, total] = await queryBuilder.getManyAndCount();

    const data = roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions:
        role.rolePermissions?.map((rp) => ({
          id: rp.permission.id,
          name: rp.permission.name,
          label: rp.permission.label,
        })) || [],
    }));

    return { data, total };
  }

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

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const { permission_id, name, description } = createRoleDto;

    await this.permissionService.validatePermissionsExist(permission_id);

    const existingRole = await this.roleRepository.findOne({
      where: { name },
      withDeleted: true,
    });

    if (existingRole && !existingRole.deleted_at) {
      throw new ConflictException(
        'El rol con este nombre ya existe y está activo.',
      );
    }

    return await this.dataSource.transaction(async (manager: EntityManager) => {
      let roleToReturn: Role;

      if (existingRole) {
        await manager.restore(Role, existingRole.id);

        const updatedRole: Role = manager.merge(Role, existingRole, {
          description,
        });
        roleToReturn = await manager.save(Role, updatedRole);

        if (permission_id && permission_id.length > 0) {
          await manager.delete(RolePermission, { role_id: roleToReturn.id });

          await this.rolePermissionService.createMany(
            manager,
            roleToReturn.id,
            permission_id,
          );
        }
      } else {
        const newRole: Role = manager.create(Role, { name, description });
        roleToReturn = await manager.save(Role, newRole);

        if (permission_id && permission_id.length > 0) {
          await this.rolePermissionService.createMany(
            manager,
            roleToReturn.id,
            permission_id,
          );
        }
      }

      return roleToReturn;
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const { permission_id, name, description } = updateRoleDto;

    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role)
      throw new NotFoundException(`El rol con ID ${id} no encontrado.`);

    if (name && name !== role.name) {
      const duplicateRole = await this.roleRepository.findOne({
        where: {
          name,
          id: Not(id),
        },
        withDeleted: true,
      });

      if (duplicateRole)
        throw new ConflictException('Ya existe otro rol con este nombre.');

      if (permission_id && permission_id.length > 0)
        await this.permissionService.validatePermissionsExist(permission_id);
    }

    return await this.dataSource.transaction(async (manager: EntityManager) => {
      const roleToUpdate = manager.merge(Role, role, {
        name,
        description,
      });

      const savedRole = await manager.save(Role, roleToUpdate);

      if (permission_id) {
        await manager.delete(RolePermission, { role_id: id });

        if (permission_id.length > 0) {
          await this.rolePermissionService.createMany(
            manager,
            id,
            permission_id,
          );
        }
      }

      return savedRole;
    });
  }

  async remove(id: number): Promise<void> {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (!role)
      throw new NotFoundException(
        `El rol con ID ${id} no existe o ya fue eliminado.`,
      );

    await this.roleRepository.softDelete(id);
  }
}
