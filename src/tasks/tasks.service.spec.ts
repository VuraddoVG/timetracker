import { Test, TestingModule } from '@nestjs/testing';
import TasksService from './tasks.service';

class ApiServiceMock {
  getTask(title: string, description: string, timeCounted: number) {
    return {
      title: 'John Doe',
      description: 'Who is he?',
      timeCounted: 0
    };
  }
}

describe('TasksService', () => {
  let tasksService: TasksService;

  beforeEach(async () => {
    const ApiServiceProvider = {
      provide: TasksService,
      useClass: ApiServiceMock,
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, ApiServiceProvider],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
  });

  it('TasksService - should be defined', () => {
    expect(tasksService).toBeDefined();
  });

  describe('getTasks', () => {
    it('should get tasks', async () => {
      const expected = 0;
      const res = await tasksService.getAllTasks();
      expect(res[0].timeCounted).toEqual(expected);
    });
  });
});
