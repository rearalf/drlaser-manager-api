import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserPermission } from './entities/user-permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Permission } from './entities/permission.entity';
import { UserRole } from './entities/user-role.entity';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';

import { RolePermissionService } from './services/role-permission.service';
import { PermissionService } from './services/permission.service';
import { UserRoleService } from './services/user-role.service';
import { UserService } from './services/user.service';
import { RoleService } from './services/role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      UserRole,
      Permission,
      RolePermission,
      UserPermission,
    ]),
  ],
  providers: [
    UserService,
    RoleService,
    UserRoleService,
    PermissionService,
    RolePermissionService,
  ],
  exports: [UserService],
})
export class UserModule {}
