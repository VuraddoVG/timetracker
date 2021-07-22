import { Max, Min } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Task {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @Max(50)
  public title: string;

  @Column()
  public description: string;

  /**
   * Planned
   * Ongoing
   * Pasued
   * Completed
   * Overdue
   */
  @Column({ default: 'Planned' })
  public status: string;

  @Column({ default: 0 })
  @Min(0)
  public timeCounted: number;

  @CreateDateColumn()
  public started_at?: Date;

  @Column({ nullable: true })
  public updated_at?: Date;

  @Column({ nullable: true })
  public completed_at?: Date;

  @Column({ nullable: true })
  public due_to?: Date;
}

export default Task;
