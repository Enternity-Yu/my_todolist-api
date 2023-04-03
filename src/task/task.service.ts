import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../entities/task.entity';
import { TagEntity } from '../entities/tag.entity';
import { TaskTagEntity } from '../entities/tasktag.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private readonly tagRepository: Repository<TagEntity>,
    private readonly taskTagRepository: Repository<TaskTagEntity>,
  ) {}

  async getAllTask(): Promise<TaskEntity[]> {
    await this.taskRepository.find();
    await this.tagRepository.find();

    return;
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
