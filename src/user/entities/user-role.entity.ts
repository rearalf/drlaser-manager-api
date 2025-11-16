import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity('user_role')
@Unique(['user_id', 'role_id'])
export class UserRole {
  @ApiProperty({
    description: 'Unique identifier for the user role record.',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Foreign key referencing the Role ID.',
    example: 2,
  })
  @Column({
    comment: 'Foreign key to the Role table',
  })
  role_id: number;

  @ApiProperty({
    description: 'Foreign key referencing the User ID.',
    example: 10,
  })
  @Column({
    comment: 'Foreign key to the User table',
  })
  user_id: number;

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

  @ManyToOne(() => Role, (role) => role.userRoles)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => User, (user) => user.userRoles)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
