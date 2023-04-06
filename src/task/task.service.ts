import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async findAllTasks(): Promise<TaskEntity[]> {
    return this.taskRepository.find();
  }

  async createTask(name: string, tags: string[]): Promise<TaskEntity> {
    if (!name || !tags.length) throw new Error('Name or tags is empty.');

    const task = new TaskEntity();
    task.name = name;
    task.tags = tags.toString();

    return await this.taskRepository.save(task);
  }

  async updateTask(
    id: number,
    name: string,
    tags: string[],
    isFinished: boolean,
  ): Promise<TaskEntity> {
    const result = await this.taskRepository.findOne({ where: { id } });

    if (result) {
      result.name = name;
      result.tags = tags.toString();
      result.isFinished = isFinished;
      return await this.taskRepository.save(result);
    } else {
      throw new Error('Task id is not exist.');
    }
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.findOne({ where: { id } });

    if (result) {
      await this.taskRepository.delete(id);
    } else {
      throw new Error('Task id is not exist.');
    }
  }
}
