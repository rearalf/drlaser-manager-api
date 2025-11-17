import { IsNumber, IsNotEmpty } from 'class-validator';
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

import { Specialty } from './specialty.entity';
import { Doctor } from './doctor.entity';

@Entity('doctor_specialty')
@Unique(['doctor_id', 'specialty_id'])
export class DoctorSpecialty {
  @ApiProperty({ description: 'Unique identifier for the junction record.' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Foreign key referencing the Doctor ID.',
    example: 1,
  })
  @Column({ comment: 'Foreign key to the Doctor table', nullable: false })
  @IsNotEmpty()
  @IsNumber()
  doctor_id: number;

  @ApiProperty({
    description: 'Foreign key referencing the Specialty ID.',
    example: 5,
  })
  @Column({ comment: 'Foreign key to the Specialty table', nullable: false })
  @IsNotEmpty()
  @IsNumber()
  specialty_id: number;

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
  @ManyToOne(() => Doctor, (doctor) => doctor.doctorSpecialties)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @ManyToOne(() => Specialty, (specialty) => specialty.doctorSpecialties)
  @JoinColumn({ name: 'specialty_id' })
  specialty: Specialty;
}
