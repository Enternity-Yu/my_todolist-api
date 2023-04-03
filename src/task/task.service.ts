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

  async getAllTask(): Promise<TaskEntity[]> {
    return await this.taskRepository.find();
  }

  // async create(task: Task): Promise<Task> {
  //   return await this.taskRepository.save(task);
  // }
  // findUser(sid: string): string {
  //   if (sid === '123456') {
  //     return 'Kid is here.';
  //   }
  //   return 'No one here.';
  // }
}
