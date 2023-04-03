import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from '../task.controller';
import { TaskService } from '../task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskEntity } from '../../entities/task.entity';
import { Repository } from 'typeorm';

const mockTask = { id: 1, name: 'study', isFinished: false };

describe('TaskController', () => {
  let taskController: TaskController;
  let taskService: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: {
            findAllTask: jest.fn(),
          },
        },
      ],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  describe('user', () => {
    it('should return', () => {
      const mockTasks: TaskEntity[] = [
        {
          id: 1,
          name: 'Task 1',
          isFinished: false,
        },
        {
          id: 2,
          name: 'Task 2',
          isFinished: false,
        },
      ];

      const getAllTaskSpy = jest
        .spyOn(taskService, 'getAllTask')
        .mockImplementation(async () => mockTasks);

      taskController.findAll();

      expect(getAllTaskSpy).toHaveBeenCalled();
    });
  });
});
