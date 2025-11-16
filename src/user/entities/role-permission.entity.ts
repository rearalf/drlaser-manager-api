import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  Unique,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Entity('role_permission')
@Unique(['role_id', 'permission_id'])
export class RolePermission {
  @ApiProperty({
    description: 'Unique identifier for the role permission record.',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Foreign key referencing the Role ID.',
    example: 1,
  })
  @Column({
    comment: 'Foreign key to the Role table',
  })
  role_id: number;

  @ApiProperty({
    description: 'Foreign key referencing the Permission ID.',
    example: 5,
  })
  @Column({
    comment: 'Foreign key to the Permission table',
  })
  permission_id: number;

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

  // --- RELATIONS ---

  @ManyToOne(() => Role, (role) => role.rolePermissions)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
