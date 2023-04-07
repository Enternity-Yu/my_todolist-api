import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskEntity } from '../entities/task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import clearAllMocks = jest.clearAllMocks;

const mockTasks: TaskEntity[] = [
  { id: 0, name: 'test1', tags: 'study', isFinished: false },
  { id: 1, name: 'test2', tags: 'work,life', isFinished: true },
];

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepository: Repository<TaskEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(TaskEntity),
          useClass: Repository,
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<TaskEntity>>(
      getRepositoryToken(TaskEntity),
    );

    jest
      .spyOn(taskRepository, 'save')
      .mockImplementation(
        (task: TaskEntity): Promise<TaskEntity> => Promise.resolve(task),
      );
    jest
      .spyOn(taskRepository, 'find')
      .mockImplementation(async () => mockTasks);
    jest
      .spyOn(taskRepository, 'findOne')
      .mockImplementation(async () => mockTasks[0]);
    jest
      .spyOn(taskRepository, 'delete')
      .mockResolvedValue({ affected: 1, raw: 0 });
  });

  afterEach(async () => clearAllMocks());

  it('should find all tasks', async () => {
    const tasks = await taskService.findAllTasks();

    expect(taskRepository.find).toHaveBeenCalledTimes(1);
    expect(tasks).toHaveLength(2);
    expect(tasks).toEqual(mockTasks);
  });

  it('should create task successfully', async () => {
    const newTask = { name: 'new task', tags: ['life'] };

    const result = await taskService.createTask(newTask.name, newTask.tags);

    expect(result.name).toEqual(newTask.name);
    expect(result.tags).toEqual(newTask.tags.toString());
    expect(taskRepository.save).toHaveBeenCalledWith({
      name: 'new task',
      tags: 'life',
    });
  });

  it('should prevent task created which name or tag is empty', () => {
    expect(taskService.createTask('', [])).rejects.toThrow(
      'Failed to create a new task.',
    );
  });

  it('should update task', async () => {
    const newTask = {
      id: 0,
      name: 'update test1',
      tags: ['study'],
      isFinished: true,
    };
    const updatedTask = await taskService.updateTask(
      newTask.id,
      newTask.name,
      newTask.tags,
      newTask.isFinished,
    );

    expect(updatedTask.id).toEqual(0);
    expect(updatedTask.name).toEqual('update test1');
    expect(updatedTask.isFinished).toEqual(true);

    expect(taskRepository.save).toHaveBeenCalledWith({
      ...newTask,
      tags: newTask.tags.toString(),
    });
  });

  it('should prevent task updated which id is not exist', () => {
    jest.spyOn(taskRepository, 'findOne').mockResolvedValue(null);

    expect(
      taskService.updateTask(999, 'update', ['study'], true),
    ).rejects.toThrow('Task not found.');
  });

  it('should delete task by id', async () => {
    await taskService.deleteTask(0);
    await expect(taskRepository.delete).toHaveBeenCalledWith(0);
  });

  it('should prevent task deleted which id is not exist', () => {
    jest.spyOn(taskRepository, 'findOne').mockResolvedValue(null);

    expect(taskService.deleteTask(999)).rejects.toThrow('Task not found.');
  });

  it('should prevent task deleted when error', () => {
    jest.spyOn(taskRepository, 'delete').mockRejectedValue(new Error('Error'));

    expect(taskService.deleteTask(1)).rejects.toThrowError('Error');
  });
});
