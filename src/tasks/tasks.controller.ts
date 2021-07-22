import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import CreateTaskDto from './dto/create-task.dto';
import UpdateTaskDto from './dto/update-task.dto';
import Task from './task.entity';
import TasksService from './tasks.service';

@Controller('tasks')
export default class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   *
   * @returns all tasks
   */
  @Get()
  getTasks() {
    return this.tasksService.getAllTasks();
  }

  /**
   *
   * @returns task with status "Ongoing"
   */
  @Get('ongoing')
  getCurrentTask() {
    return this.tasksService.getCurrentTask();
  }

  /**
   * 
   * @param id of the task
   * @returns task with zpecified id
   */
  @Get(':id')
  getTaskById(@Param('id') id: number) {
    return this.tasksService.getTaskById(id);
  }

  /**
   * 
   * @param task body as json
   * @returns a newly created task obj
   */
  @Post()
  async createTask(@Body() task: CreateTaskDto) {
    return this.tasksService.createTask(task);
  }

  /**
   * 
   * @param id of the wanted task
   * @param status to update to
   * @returns 
   */
  @Patch(':id,:status')
  async updateStatusTask(
    @Param('id') id: number,
    @Param('status') status: string,
  ) {
    return this.tasksService.updateStatusTask(id, status);
  }

  /**
   * 
   * @param updateTaskDto a DTO to work with DB
   * @param id of the wanted task
   * @returns update task
   */
  @Patch(':id')
  public async update(
    @Body() updateTaskDto: UpdateTaskDto,
    @Param('id') id: number,
  ): Promise<Task> {
    const task = await this.tasksService.updateTask(id, updateTaskDto);
    return task;
  }

  /**
   * 
   * @param id of the wanted task 
   * @returns 
   */
  @Delete(':id')
  async deleteTask(@Param() { id }) {
    return this.tasksService.deleteTask(Number(id));
  }
}
