import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TaskModule } from './task/task.module';

@Module({
  imports: [TaskModule],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
