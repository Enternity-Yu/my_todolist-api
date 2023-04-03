import { Body, Controller, Get, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskEntity } from '../entities/task.entity';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async findAll(): Promise<TaskEntity[]> {
    return await this.taskService.getAllTask();
  }

  // @Post()
  // async create(@Body() task: Task): Promise<Task> {
  //   return await this.userService.create(task);
  // }
  // @Get('findOne')
  // findUser(@Query() query: any) {
  //   return this.userService.findUser(query.sid);
  // }
}
