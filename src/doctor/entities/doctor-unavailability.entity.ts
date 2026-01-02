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
  IsInt,
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

import { Doctor } from './doctor.entity';

@Entity('doctor_unavailability')
@Index(['doctor_id', 'start_time', 'end_time'])
export class DoctorUnavailability {
  @ApiProperty({
    description: 'Unique identifier for the unavailability record.',
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
    description: 'Start time of the unavailability period.',
    example: '2026-01-20T14:00:00.000Z',
  })
  @Column({
    type: 'timestamptz',
    comment: 'Start time of the unavailability period',
    nullable: false,
  })
  @IsNotEmpty()
  start_time: Date;

  @ApiProperty({
    description: 'End time of the unavailability period.',
    example: '2026-01-20T16:00:00.000Z',
  })
  @Column({
    type: 'timestamptz',
    comment: 'End time of the unavailability period',
    nullable: false,
  })
  @IsNotEmpty()
  end_time: Date;

  @ApiProperty({
    description: 'Reason for unavailability.',
    nullable: true,
    example: 'Medical conference',
  })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Reason for unavailability',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string | null;

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
