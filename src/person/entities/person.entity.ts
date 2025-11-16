import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsString,
  IsNumber,
  MaxLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

import { PersonContact } from './person-contact.entity';
import { User } from 'src/user/entities/user.entity';
import { PersonType } from './person-type.entity';

@Entity('person')
export class Person {
  @ApiProperty({ description: 'Unique identifier for the person record.' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'First name of the person.' })
  @Column({ length: 100, comment: 'First name of the person', nullable: false })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  first_name: string;

  @ApiProperty({ description: 'Middle name of the person.', nullable: true })
  @Column({ length: 100, comment: 'Middle name of the person', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  middle_name?: string;

  @ApiProperty({ description: 'Last name (surname) of the person.' })
  @Column({ length: 100, comment: 'Last name of the person', nullable: false })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  last_name: string;

  @ApiProperty({
    description: 'Name of the profile picture file.',
    nullable: true,
  })
  @Column({ length: 255, comment: 'Profile picture file name', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  profile_picture_name?: string;

  @ApiProperty({
    description: 'URL link to the profile picture.',
    nullable: true,
  })
  @Column({ length: 2048, comment: 'Profile picture URL', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  profile_picture_url?: string;

  @ApiProperty({
    description:
      'Foreign key to the associated User ID. Null if the person is not a system user.',
    example: 1,
    nullable: true,
  })
  @Column({
    comment: 'Foreign key to the User table',
    unique: true,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  user_id?: number | null;

  @ApiProperty({ description: 'Foreign key to the PersonType ID.', example: 1 })
  @Column({ comment: 'Foreign key to the PersonType table', nullable: false })
  @IsNotEmpty()
  @IsNumber()
  person_type_id: number;

  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Timestamp of the record creation',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'Timestamp of the last record update',
  })
  updated_at: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
    comment: 'Soft deletion timestamp',
  })
  deleted_at?: Date | null;

  // --- RELATIONS ---
  @OneToOne(() => User, (user) => user.person)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne(() => PersonType, (personType) => personType.persons)
  @JoinColumn({ name: 'person_type_id' })
  personType: PersonType;

  @ApiProperty({
    description: 'List of contact details associated with the person.',
    type: [PersonContact],
    isArray: true,
  })
  @OneToMany(() => PersonContact, (contact) => contact.person)
  contacts?: PersonContact[];
}
