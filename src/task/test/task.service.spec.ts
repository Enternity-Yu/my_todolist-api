import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from '../task.service';
import { TaskEntity } from '../../entities/task.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { typeOrmConfig } from '../../config/typeOrmConfig';

describe('UserService', () => {
  let taskService: TaskService;
  let taskRepository: Repository<TaskEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        TypeOrmModule.forFeature([TaskEntity]),
      ],
      providers: [TaskService],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<TaskEntity>>(
      getRepositoryToken(TaskEntity),
    );
  });

  afterEach(async () => {
    await taskRepository.clear();
  });

  describe('getAllTask', () => {
    it('should return all tasks', async () => {
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

      await taskRepository.save(mockTasks[0]);
      await taskRepository.save(mockTasks[1]);

      const tasks = await taskService.getAllTask();

      expect(tasks).toHaveLength(2);
      expect(tasks[0].name).toBe('study');
      expect(tasks[0].isFinished).toBeFalsy();
      expect(tasks[1].name).toBe('exercise');
      expect(tasks[1].isFinished).toBeTruthy();
    });
  });

  // describe('find Tasks', () => {
  //   it('should return a user', async () => {
  //     const mockTasks: Task[] = [
  //       {
  //         id: 1,
  //         name: 'Task 1',
  //         isFinished: false,
  //       },
  //       {
  //         id: 2,
  //         name: 'Task 2',
  //         isFinished: false,
  //       },
  //     ];
  //
  //     jest
  //       .spyOn(taskRepository, 'find')
  //       .mockImplementation(async () => mockTasks);
  //
  //     expect(await taskService.getAllTask()).toEqual([mockTasks]);
  //   });
  // });
});
