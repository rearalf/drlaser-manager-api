import { ApiProperty } from '@nestjs/swagger';
import {
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
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

import { Person } from './person.entity';

export enum CONTACT_TYPE_ENUM {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  WHATSAPP = 'WHATSAPP',
}

@Entity('person_contact')
export class PersonContact {
  @ApiProperty({ description: 'Unique identifier for the contact record.' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Foreign key to the associated Person ID.',
    example: 5,
  })
  @Column({ comment: 'Foreign key to the Person table', nullable: false })
  @IsNotEmpty()
  @IsNumber()
  person_id: number;

  @ApiProperty({
    description:
      'The value of the contact (e.g., email address, phone number).',
    example: '555-1234',
  })
  @Column({
    length: 255,
    comment: 'Value of the contact detail',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  contact_value: string;

  @ApiProperty({
    description: 'The type of contact (e.g., EMAIL, PHONE).',
    enum: CONTACT_TYPE_ENUM,
    example: CONTACT_TYPE_ENUM.PHONE,
  })
  @Column({
    comment: 'Type of contact (EMAIL, PHONE, etc.)',
    nullable: false,
    type: 'enum',
    enum: CONTACT_TYPE_ENUM,
  })
  @IsNotEmpty()
  @IsEnum(CONTACT_TYPE_ENUM, {
    message: `Contact type must be one of: ${Object.values(CONTACT_TYPE_ENUM).join(', ')}`,
  })
  contact_type: CONTACT_TYPE_ENUM;

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
  @ManyToOne(() => Person, (person) => person.contacts)
  @JoinColumn({ name: 'person_id' })
  person: Person;
}
