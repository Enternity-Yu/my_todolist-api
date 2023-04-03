import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TaskTagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  task_id: number;

  @Column()
  tag_id: number;
}
