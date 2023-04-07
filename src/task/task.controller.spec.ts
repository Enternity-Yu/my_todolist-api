import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskEntity } from '../entities/task.entity';
import { INestApplication, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';

describe('TaskController', () => {
  let app: INestApplication;
  let taskController: TaskController;
  let taskService: TaskService;
  let taskData: { name: string; tags: string[] };
  let updatedTask: { name: string; tags: string[]; isFinished: boolean };
  const id = 1;

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

    app = module.createNestApplication();
    await app.init();

    taskController = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);

    taskData = { name: 'test task', tags: ['test'] };
    updatedTask = {
      name: 'Updated Task 1',
      tags: ['tag1', 'tag3'],
      isFinished: true,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/tasks (GET)', () => {
    it('should return all tasks', async () => {
      const mockTasks: TaskEntity[] = [
        { id: 0, name: 'test1', tags: 'study', isFinished: false },
        { id: 1, name: 'test2', tags: 'work,life', isFinished: true },
      ];
      jest.spyOn(taskService, 'findAllTasks').mockResolvedValue(mockTasks);

      await request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .expect(mockTasks);
    });
  });

  describe('/tasks (POST)', () => {
    it('should create a new task', async () => {
      jest.spyOn(taskService, 'createTask').mockResolvedValue({
        id: 1,
        name: 'test task',
        tags: 'test',
        isFinished: false,
      });

      await request(app.getHttpServer())
        .post('/tasks')
        .send(taskData)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(taskData.name);
          expect(res.body.tags).toBe(taskData.tags.toString());
          expect(res.body.isFinished).toBeFalsy();
        });
    });

    it('should return 400 if task creation fails', async () => {
      jest
        .spyOn(taskService, 'createTask')
        .mockRejectedValueOnce(new Error('Failed to create task.'));

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(taskData);

      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBe('Failed to create task.');
    });
  });

  describe('/tasks/:id (PUT)', () => {
    it('should update a task by id', async () => {
      jest.spyOn(taskService, 'updateTask').mockResolvedValue({
        id: 1,
        name: 'Updated Task 1',
        tags: 'tag1,tag3',
        isFinished: true,
      });

      await request(app.getHttpServer())
        .put('/tasks/id')
        .send(updatedTask)
        .expect(200)
        .then((res) => {
          expect(res.body.id).toBe(id);
          expect(res.body.name).toBe(updatedTask.name);
          expect(res.body.tags).toBe(updatedTask.tags.toString());
          expect(res.body.isFinished).toBe(updatedTask.isFinished);
        });
    });

    it('should return a 404 error if the task does not exist', () => {
      jest
        .spyOn(taskService, 'updateTask')
        .mockRejectedValue(new NotFoundException());

      request(app.getHttpServer())
        .put('/tasks/id')
        .send(updatedTask)
        .expect(404);
    });
  });

  describe('/tasks/:id (DELETE)', () => {
    it('should delete the task with the given id', async () => {
      jest.spyOn(taskService, 'deleteTask').mockResolvedValue();

      request(app.getHttpServer()).delete(`/tasks/${0}`).expect(200);
    });

    it('should return 404 if task with the given id does not exist', () => {
      jest
        .spyOn(taskService, 'deleteTask')
        .mockRejectedValue(new Error('Task not Found.'));

      request(app.getHttpServer()).delete(`/tasks/${0}`).expect(404);

      expect(
        request(app.getHttpServer()).delete(`/tasks/${0}`),
      ).rejects.toThrow('Task not Found.');
    });
  });
});
