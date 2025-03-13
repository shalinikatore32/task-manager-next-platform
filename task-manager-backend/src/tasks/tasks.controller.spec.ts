// src/tasks/tasks.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

const mockTask = {
  title: 'Test Task',
  description: 'Test Description',
  status: 'pending',
};

const mockTasksService = {
  create: jest.fn().mockResolvedValue(mockTask),
  findAll: jest.fn().mockResolvedValue([mockTask]),
  findOne: jest.fn().mockResolvedValue(mockTask),
  update: jest.fn().mockResolvedValue(mockTask),
  remove: jest.fn().mockResolvedValue(mockTask),
};

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a task', async () => {
    const task = await controller.create(mockTask);
    expect(task).toEqual(mockTask);
    expect(service.create).toHaveBeenCalledWith(mockTask);
  });

  it('should return all tasks', async () => {
    const tasks = await controller.findAll();
    expect(tasks).toEqual([mockTask]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a task by ID', async () => {
    const task = await controller.findOne('1');
    expect(task).toEqual(mockTask);
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should update a task', async () => {
    const task = await controller.update('1', mockTask);
    expect(task).toEqual(mockTask);
    expect(service.update).toHaveBeenCalledWith('1', mockTask);
  });

  it('should delete a task', async () => {
    const task = await controller.remove('1');
    expect(task).toEqual(mockTask);
    expect(service.remove).toHaveBeenCalledWith('1');
  });
});
