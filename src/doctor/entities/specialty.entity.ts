import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DoctorSpecialty } from './doctor-specialty.entity';

@Entity('specialty')
export class Specialty {
  @ApiProperty({ description: 'Unique identifier for the specialty.' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description:
      'The unique name of the medical specialty (e.g., "Dermatology").',
  })
  @Column({
    unique: true,
    nullable: false,
    length: 100,
    comment: 'Unique name of the medical specialty',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Detailed description of the specialty.',
    nullable: true,
  })
  @Column({
    length: 255,
    comment: 'Detailed description of the specialty',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

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
  @OneToMany(() => DoctorSpecialty, (ds) => ds.specialty)
  @ApiProperty({
    description:
      'List of doctors associated with this specialty through the junction table.',
    type: [DoctorSpecialty],
    isArray: true,
  })
  doctorSpecialties?: DoctorSpecialty[];
}
