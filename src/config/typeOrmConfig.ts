import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TaskEntity } from '../entities/task.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'todolist',
  entities: [TaskEntity],
  synchronize: true,
};
