import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserRole } from './user-role.entity';
import { RolePermission } from './role-permission.entity';

@Entity('role')
export class Role {
  @ApiProperty({
    description: 'Unique identifier for the role.',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description:
      'The name of the role (e.g., "Admin", "User", "Guest"). Must be unique.',
    example: 'Admin',
  })
  @IsString()
  @Column({
    unique: true,
    nullable: false,
    length: 50,
    comment: 'Unique name of the role',
  })
  name: string;

  @ApiProperty({
    description:
      'A detailed description of the permissions and purpose of the role.',
    example: 'Administrator with full access to all system features.',
    nullable: false,
  })
  @IsString()
  @Column({
    nullable: false,
    length: 255,
    comment: 'Detailed description of the role capabilities',
  })
  description: string;

  @ApiProperty({
    description: 'The date and time the record was created.',
    example: '2025-11-15T23:00:00.000Z',
  })
  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Timestamp of the record creation',
  })
  created_at: Date;

  @ApiProperty({
    description: 'The date and time the record was last updated.',
    example: '2025-11-15T23:30:00.000Z',
  })
  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'Timestamp of the last record update',
  })
  updated_at: Date;

  @ApiProperty({
    description:
      'Date and time of the soft deletion (Soft Delete). Null if the role is active.',
    example: null,
    nullable: true,
  })
  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
    comment: 'Soft deletion timestamp',
  })
  deleted_at: Date | null;

  // --- RELATIONS ---

  @ApiProperty({
    description:
      'List of users associated with this role through the junction table.',
    type: [UserRole],
    isArray: true,
  })
  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];

  @ApiProperty({
    description:
      'List of permissions assigned to the role through the junction table.',
    type: [RolePermission],
    isArray: true,
  })
  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];
}
