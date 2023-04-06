import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskEntity } from '../entities/task.entity';

@Controller('/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @HttpCode(200)
  async findAll(): Promise<TaskEntity[]> {
    try {
      return await this.taskService.findAllTasks();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message(),
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @Post()
  @HttpCode(200)
  async create(
    @Body() taskData: { name: string; tags: string[] },
  ): Promise<TaskEntity> {
    try {
      return await this.taskService.createTask(taskData.name, taskData.tags);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @HttpCode(200)
  async delete(@Param('id') id: number) {
    try {
      return await this.taskService.deleteTask(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: number,
    @Body() taskData: { name: string; tags: string[]; isFinished: boolean },
  ) {
    try {
      return await this.taskService.updateTask(
        id,
        taskData.name,
        taskData.tags,
        taskData.isFinished,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
