import { ApiProperty } from '@nestjs/swagger';
import {
  Index,
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  Max,
  Min,
  IsInt,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

import { Doctor } from './doctor.entity';

@Entity('doctor_availability')
@Index(['doctor_id', 'start_time', 'end_time'])
export class DoctorAvailability {
  @ApiProperty({
    description: 'Unique identifier for the availability record.',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Foreign key to the associated Doctor ID.',
    example: 1,
  })
  @Column({
    comment: 'Foreign key to the Doctor table',
    nullable: false,
  })
  @IsNotEmpty()
  @IsInt()
  doctor_id: number;

  @ApiProperty({
    description: 'Start time of the availability period.',
    example: '2026-01-15T09:00:00.000Z',
  })
  @Column({
    type: 'timestamptz',
    comment: 'Start time of the availability period',
    nullable: false,
  })
  @IsNotEmpty()
  start_time: Date;

  @ApiProperty({
    description: 'End time of the availability period.',
    example: '2026-01-15T17:00:00.000Z',
  })
  @Column({
    type: 'timestamptz',
    comment: 'End time of the availability period',
    nullable: false,
  })
  @IsNotEmpty()
  end_time: Date;

  @ApiProperty({
    description: 'Indicates if this availability is recurring.',
    default: false,
  })
  @Column({
    type: 'boolean',
    default: false,
    comment: 'Indicates if this availability is recurring',
  })
  @IsBoolean()
  is_recurring: boolean;

  @ApiProperty({
    description:
      'Day of the week for recurring availability (0=Sunday, 6=Saturday).',
    nullable: true,
    example: 1,
    minimum: 0,
    maximum: 6,
  })
  @Column({
    type: 'int',
    nullable: true,
    comment:
      'Day of the week (0=Sunday, 6=Saturday) for recurring availability',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  day_of_week?: number | null;

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
  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;
}
