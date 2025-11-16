import { IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';

import { Person } from 'src/person/entities/person.entity';
import { UserRole } from './user-role.entity';

@Entity('user')
export class User {
  @ApiProperty({
    description: 'Unique identifier for the user.',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "The user's email address (must be unique).",
    example: 'user@example.com',
  })
  @IsEmail()
  @Column({
    unique: true,
    nullable: false,
    length: 255,
    comment: 'Unique email address of the user',
  })
  email: string;

  @ApiProperty({
    description: "The user's encrypted password.",
    example: 'secure_password_hash',
  })
  @Length(8, 32)
  @Column({
    nullable: false,
    length: 255,
    comment: 'User password (stored as a hash)',
  })
  password: string;

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
      'Date and time of the soft deletion (Soft Delete). Null if the user is active.',
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
      'List of roles assigned to the user through the junction table.',
    type: [UserRole],
    isArray: true,
  })
  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @ApiProperty({
    description:
      'The personal record (first name, last name, etc.) linked to this user account. Optional.',
    type: Person,
    nullable: true,
  })
  @OneToOne(() => Person, (person) => person.user)
  person?: Person;
}
