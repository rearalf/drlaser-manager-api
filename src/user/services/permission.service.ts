import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async findAll(): Promise<Permission[]> {
    const permissions = await this.permissionRepository
      .createQueryBuilder('permission')
      .select(['permission.id', 'permission.name', 'permission.label'])
      .where('permission.parent IS NOT NULL')
      .orderBy('permission.id', 'ASC')
      .getMany();

    return permissions;
  }

  async findAllGrouped(): Promise<Permission[]> {
    const rawPermissions = await this.permissionRepository
      .createQueryBuilder('parent')
      .leftJoinAndSelect('parent.children', 'child')
      .where('parent.parent IS NULL')
      .select([
        'parent.id',
        'parent.name',
        'parent.label',
        'child.id',
        'child.name',
        'child.label',
      ])
      .orderBy('parent.id', 'ASC')
      .addOrderBy('child.id', 'ASC')
      .getMany();

    return rawPermissions;
  }

  async findById(id: number): Promise<Permission> {
    const permission = await this.permissionRepository
      .createQueryBuilder('permission')
      .select(['permission.id', 'permission.name', 'permission.description'])
      .where('permission.id = :id', { id })
      .getOne();

    if (!permission) throw new NotFoundException('Permiso no encontrado.');

    return permission;
  }
}
