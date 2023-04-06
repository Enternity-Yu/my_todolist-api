import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskModule } from './task.module';

describe('UserModule', () => {
  let userModule: TaskModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TaskModule],
      controllers: [TaskController],
      providers: [TaskService],
    }).compile();

    userModule = module.get<TaskModule>(TaskModule);
  });

  it('should be defined', () => {
    expect(userModule).toBeDefined();
  });
});
