import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RolePermission } from './role-permission.entity';
import { UserPermission } from './user-permission.entity';

@Entity('permission')
export class Permission {
  @ApiProperty({
    description: 'Unique identifier for the permission.',
    example: 5,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description:
      'The unique programmatic name of the permission (e.g., "users:read", "products:create").',
    example: 'users:read',
  })
  @IsString()
  @Column({
    unique: true,
    nullable: false,
    length: 100,
    comment: 'Unique programmatic name of the permission',
  })
  name: string;

  @ApiProperty({
    description: 'A detailed explanation of what this permission grants.',
    example: 'Allows users to view the list of all active user accounts.',
    nullable: false,
  })
  @IsString()
  @Column({
    nullable: false,
    length: 255,
    comment: 'Detailed description of the permission capability',
  })
  description: string;

  @ApiProperty({
    description:
      'A user-friendly label for displaying the permission in UIs (e.g., "Read Users").',
    example: 'Read Users',
    nullable: false,
  })
  @IsString()
  @Column({
    nullable: false,
    unique: true,
    length: 100,
    comment: 'User-friendly label for the permission',
  })
  label: string;

  @ApiProperty({
    description:
      'The ID of the parent permission, allowing for hierarchical grouping. Null if it is a root permission.',
    example: 1,
    nullable: true,
  })
  @Column({
    nullable: true,
    comment: 'Foreign key to the parent permission',
  })
  parent_permission_id: number | null;

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
      'Date and time of the soft deletion (Soft Delete). Null if active.',
    example: null,
    nullable: true,
  })
  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
    comment: 'Soft deletion timestamp',
  })
  deleted_at: Date | null;

  // --- RECURSIVE RELATIONS ---

  @ManyToOne(() => Permission, (permission) => permission.children)
  @JoinColumn({ name: 'parent_permission_id' })
  parent: Permission;

  @OneToMany(() => Permission, (permission) => permission.parent)
  @ApiProperty({
    description: 'List of child permissions under this parent.',
    type: [Permission],
    isArray: true,
  })
  children: Permission[];

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission,
  )
  @ApiProperty({
    description:
      'List of roles associated with this permission through the junction table.',
    type: [RolePermission],
    isArray: true,
  })
  rolePermissions: RolePermission[];

  @OneToMany(
    () => UserPermission,
    (userPermission) => userPermission.permission,
  )
  @ApiProperty({
    description:
      'List of users associated with this permission through the junction table.',
    type: [UserPermission],
    isArray: true,
  })
  userPermission: UserPermission[];
}
