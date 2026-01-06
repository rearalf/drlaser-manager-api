import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserPermission } from './entities/user-permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Permission } from './entities/permission.entity';
import { UserRole } from './entities/user-role.entity';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';

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
})
export class UserModule {}
