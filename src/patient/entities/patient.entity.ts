import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsEnum,
  IsString,
  IsNumber,
  IsBoolean,
  MaxLength,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsPhoneNumber,
} from 'class-validator';

import { Person } from 'src/person/entities/person.entity';

export enum GENDER_ENUM {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFERS_NOT_TO_SAY = 'PREFERS_NOT_TO-SAY',
}

@Entity('patient')
export class Patient {
  @ApiProperty({ description: 'Unique identifier for the patient record.' })
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty({
    description: 'Foreign key to the associated Person ID (unique link).',
    example: 15,
  })
  @Column({
    comment: 'Foreign key to the Person table',
    unique: true,
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  person_id: number;

  // --- Información Clínica General ---

  @ApiProperty({
    description: "Patient's date of birth.",
    example: '1990-01-01',
  })
  @Column({ type: 'date', comment: "Patient's date of birth", nullable: false })
  @IsNotEmpty()
  @IsDateString()
  birth_date: Date;

  @ApiProperty({
    description: 'Detailed general medical history.',
    nullable: true,
  })
  @Column({ type: 'text', comment: 'General medical history', nullable: true })
  @IsOptional()
  @IsString()
  medical_history?: string;

  @ApiProperty({ description: 'Known allergic reactions.', nullable: true })
  @Column({ type: 'text', comment: 'Known allergic reactions', nullable: true })
  @IsOptional()
  @IsString()
  allergic_reactions?: string;

  @ApiProperty({
    description: 'Current systemic treatments and medications.',
    nullable: true,
  })
  @Column({
    type: 'text',
    comment: 'Current systemic treatment and medications',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  current_systemic_treatment?: string;

  @ApiProperty({ description: 'Laboratory results details.', nullable: true })
  @Column({
    type: 'text',
    comment: 'Laboratory results details',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  lab_results?: string;

  @ApiProperty({
    description: 'Indicates if the complete odontogram chart is attached.',
    example: false,
  })
  @Column({
    type: 'boolean',
    comment: 'Status of the complete odontogram chart',
    nullable: true,
  })
  @IsOptional()
  @IsBoolean()
  complete_odontogram?: boolean;

  @ApiProperty({
    description: "Patient's gender.",
    enum: GENDER_ENUM,
    example: GENDER_ENUM.FEMALE,
  })
  @Column({
    type: 'enum',
    enum: GENDER_ENUM,
    comment: "Patient's gender",
    nullable: false,
  })
  @IsNotEmpty()
  @IsEnum(GENDER_ENUM)
  gender: GENDER_ENUM;

  @ApiProperty({ description: 'Contact phone number.', nullable: true })
  @Column({ length: 50, comment: 'Contact phone number', nullable: true })
  @IsOptional()
  @IsPhoneNumber('SV')
  @MaxLength(50)
  phone?: string;

  @ApiProperty({ description: "Patient's home address.", nullable: true })
  @Column({ length: 255, comment: "Patient's home address", nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiProperty({ description: "Patient's occupation.", nullable: true })
  @Column({ length: 100, comment: "Patient's occupation", nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  occupation?: string;

  // --- Evaluación Sistémica (Bools) ---

  @ApiProperty({
    description: 'Indicates issues with the Central Nervous System (SNC).',
    example: false,
  })
  @Column({
    type: 'boolean',
    default: false,
    comment: 'Central Nervous System issues (SNC)',
    nullable: false,
  })
  @IsBoolean()
  has_snc_issues: boolean;

  @ApiProperty({
    description: 'Indicates issues with the Vascular System (SVC).',
    example: false,
  })
  @Column({
    type: 'boolean',
    default: false,
    comment: 'Vascular System issues (SVC)',
    nullable: false,
  })
  @IsBoolean()
  has_svc_issues: boolean;

  @ApiProperty({
    description: 'Indicates issues with the Endocrine System (SE).',
    example: false,
  })
  @Column({
    type: 'boolean',
    default: false,
    comment: 'Endocrine System issues (SE)',
    nullable: false,
  })
  @IsBoolean()
  has_se_issues: boolean;

  @ApiProperty({
    description: 'Indicates issues with the Musculoskeletal System (SME).',
    example: false,
  })
  @Column({
    type: 'boolean',
    default: false,
    comment: 'Musculoskeletal System issues (SME)',
    nullable: false,
  })
  has_sme_issues: boolean;

  @ApiProperty({
    description: 'Indicates issues with the Respiratory System (SR).',
    example: false,
  })
  @Column({
    type: 'boolean',
    default: false,
    comment: 'Respiratory System issues (SR)',
    nullable: false,
  })
  has_sr_issues: boolean;

  @ApiProperty({
    description: 'Indicates issues with the Urinary System (SU).',
    example: false,
  })
  @Column({
    type: 'boolean',
    default: false,
    comment: 'Urinary System issues (SU)',
    nullable: false,
  })
  has_su_issues: boolean;

  @ApiProperty({
    description: 'Indicates issues with the Genitourinary System (SGU).',
    example: false,
  })
  @Column({
    type: 'boolean',
    default: false,
    comment: 'Genitourinary System issues (SGU)',
    nullable: false,
  })
  has_sgu_issues: boolean;

  @ApiProperty({
    description: 'Indicates issues with the Gastrointestinal System (SGI).',
    example: false,
  })
  @Column({
    type: 'boolean',
    default: false,
    comment: 'Gastrointestinal System issues (SGI)',
    nullable: false,
  })
  has_sgi_issues: boolean;

  @ApiProperty({
    description: 'Consolidated notes on the systemic evaluation.',
    nullable: true,
  })
  @Column({
    type: 'text',
    comment: 'Consolidated notes on systemic evaluation',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  system_evaluation_notes?: string;

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
  @OneToOne(() => Person, (person) => person.patient)
  @JoinColumn({ name: 'person_id' })
  person: Person;
}
