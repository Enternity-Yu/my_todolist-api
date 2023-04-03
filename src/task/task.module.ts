import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from '../entities/task.entity';
import { typeOrmConfig } from '../config/typeOrmConfig';
import { TagEntity } from '../entities/tag.entity';
import { TaskTagEntity } from '../entities/tasktag.entity';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig)],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
