import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
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

import { Person } from './person.entity';

@Entity('person_type')
export class PersonType {
  @ApiProperty({ description: 'Unique identifier for the person type.' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'The name of the person type (e.g., "Client", "Employee").',
  })
  @Column({ length: 100, comment: 'Name of the person type', nullable: false })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Detailed description of the person type.',
    nullable: true,
  })
  @Column({
    length: 255,
    comment: 'Detailed description of the person type',
    nullable: true,
  })
  @IsString()
  @MaxLength(255)
  description: string;

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
  @OneToMany(() => Person, (person) => person.personType)
  @ApiProperty({
    description: 'List of all persons belonging to this type.',
    type: [Person],
    isArray: true,
  })
  persons?: Person[];
}
