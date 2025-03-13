// src/tasks/tasks.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TasksService } from './tasks.service';
import { Task } from './tasks.schema';
import { Model } from 'mongoose';

const mockTask = {
  title: 'Test Task',
  description: 'Test Description',
  status: 'pending',
};

const mockTaskModel = {
  create: jest.fn().mockResolvedValue(mockTask),
  find: jest.fn().mockResolvedValue([mockTask]),
  findById: jest.fn().mockResolvedValue(mockTask),
  findByIdAndUpdate: jest.fn().mockResolvedValue(mockTask),
  findByIdAndDelete: jest.fn().mockResolvedValue(mockTask),
};

describe('TasksService', () => {
  let service: TasksService;
  let model: Model<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task.name),
          useValue: mockTaskModel,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    model = module.get<Model<Task>>(getModelToken(Task.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task', async () => {
    const task = await service.create(mockTask);
    expect(task).toEqual(mockTask);
    expect(model.create).toHaveBeenCalledWith(mockTask);
  });

  it('should return all tasks', async () => {
    const tasks = await service.findAll();
    expect(tasks).toEqual([mockTask]);
    expect(model.find).toHaveBeenCalled();
  });

  it('should return a task by ID', async () => {
    const task = await service.findOne('1');
    expect(task).toEqual(mockTask);
    expect(model.findById).toHaveBeenCalledWith('1');
  });

  it('should update a task', async () => {
    const task = await service.update('1', mockTask);
    expect(task).toEqual(mockTask);
    expect(model.findByIdAndUpdate).toHaveBeenCalledWith('1', mockTask, {
      new: true,
    });
  });

  it('should delete a task', async () => {
    const task = await service.remove('1');
    expect(task).toEqual(mockTask);
    expect(model.findByIdAndDelete).toHaveBeenCalledWith('1');
  });
});
