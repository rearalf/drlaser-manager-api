import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  OneToOne,
  ManyToOne,
  OneToMany,
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
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

import { DoctorSpecialty } from './doctor-specialty.entity';
import { Person } from 'src/person/entities/person.entity';
import { Specialty } from './specialty.entity';

@Entity('doctor')
export class Doctor {
  @ApiProperty({ description: 'Unique identifier for the doctor record.' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Foreign key to the associated Person ID.',
    example: 10,
  })
  @Column({
    comment: 'Foreign key to the Person table',
    unique: true,
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  person_id: number;

  @ApiProperty({
    description: 'Primary specialty ID of the doctor.',
    example: 1,
  })
  @Column({
    comment: 'Foreign key to the primary Specialty table',
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  specialty_id: number;

  @ApiProperty({
    description: 'Doctor’s qualification or professional license number.',
    nullable: true,
  })
  @Column({
    length: 100,
    comment: 'Doctor’s qualification or professional license number',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  qualification?: string;

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
  @OneToOne(() => Person, (person) => person.doctor)
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @ManyToOne(() => Specialty)
  @JoinColumn({ name: 'specialty_id' })
  primarySpecialty: Specialty;

  @OneToMany(() => DoctorSpecialty, (ds) => ds.doctor)
  @ApiProperty({
    description: 'List of all specialties associated with the doctor.',
    type: [DoctorSpecialty],
    isArray: true,
  })
  doctorSpecialties?: DoctorSpecialty[];
}
