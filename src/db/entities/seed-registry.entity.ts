import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class SeedRegistry {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  seed_name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  executed_at: Date;

  @CreateDateColumn({ type: 'timestamptz', nullable: true, select: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true, select: false })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true, select: false })
  deleted_at: Date;
}
