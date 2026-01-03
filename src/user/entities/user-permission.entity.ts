import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity()
export class UserPermission {
  @ApiProperty({
    description: 'Unique identifier for the role permission record.',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Foreign key referencing the User ID.',
    example: 1,
  })
  @Column({
    comment: 'Foreign key to the User table',
  })
  user_id: number;

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

  @ManyToOne(() => User, (user) => user.userPermission)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Permission, (permission) => permission.userPermission)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
