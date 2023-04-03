import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from '../task.service';
import { Task } from '../../entities/task.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let taskService: TaskService;
  let taskRepository: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '123456',
          database: 'todolist',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Task]),
      ],
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterEach(async () => {
    await taskRepository.clear();
  });

  describe('getAllTask', () => {
    it('should return all tasks', async () => {
      const mockTasks: Task[] = [
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
