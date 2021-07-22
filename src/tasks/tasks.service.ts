import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateTaskDto from './dto/create-task.dto';
import UpdateTaskDto from './dto/update-task.dto';
import Task from './task.entity';

@Injectable()
export default class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  getAllTasks() {
    return this.tasksRepository.find();
  }

  async getTaskById(id: number) {
    const task = await this.tasksRepository.findOne(id);
    if (task) {
      return task;
    }
    throw new HttpException('Task not found by id', HttpStatus.NOT_FOUND);
  }

  /**
   * Current task being defined by status "Ongoing"
   */
  async getCurrentTask(): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { status: 'Ongoing' },
    });
    if (task) {
      return task;
    }
    throw new HttpException('No current Task.', HttpStatus.NOT_FOUND);
  }

  async createTask(task: CreateTaskDto) {
    const newTask = this.tasksRepository.create(task);
    await this.tasksRepository.save(newTask);
    return newTask;
  }

  /**
   *
   * @param taskId
   * @param updateTaskDto
   * @returns
   */
  public async updateTask(
    taskId: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const { title, description, completed_at, due_to } = updateTaskDto;
    const task = await this.tasksRepository.findOne(taskId);
    if (title) task.title = title;
    if (description) task.description = description;
    task.updated_at = new Date();
    if (completed_at) task.completed_at = completed_at;
    if (due_to) task.due_to = due_to;

    await this.tasksRepository.save(task);
    return task;
  }

  /**
   *
   * @param id
   */
  async deleteTask(id: number) {
    const deleteResponse = await this.tasksRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException(
        'Task not found by id to delete',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * By default task has "Planned" status from which we can only move to "Ongoing"
   * then it is possibly to complete the task or put it on pause.
   * Each pause of a task and completion calculates spent time on it from prvieous update time.
   * @param id of the wanted task
   * @param status to be update to
   */
  async updateStatusTask(id: number, status: string) {
    const task = await this.getTaskById(id);
    if (task.due_to < new Date() && task.due_to) task.status = 'Overdue';
    let date = new Date();
    switch (status) {
      case 'Paused':
        if (task.updated_at != task.started_at && task.status === 'Ongoing') {
          task.status = 'Paused';
          task.timeCounted += this.calcTime(task.updated_at, date);
          task.updated_at = date;
        }
        break;
      case 'Ongoing':
        if (task.status === 'Planned' || task.status === 'Paused') {
          task.status = 'Ongoing';
          task.updated_at = date;
        }
        break;
      case 'Completed':
        if (task.status !== 'Planned') task.status = 'Completed';
        task.timeCounted += this.calcTime(task.updated_at, date);
        task.updated_at = date;
        task.completed_at = date;
        break;
      default:
        throw new HttpException(
          'Task not found with such status',
          HttpStatus.NOT_FOUND,
        );
    }

    this.tasksRepository.save(task);
  }

  /**
   * Utility to calculate differance
   * @param d1
   * @param d2
   * @returns spent time per session
   */
  private calcTime(d1: Date, d2: Date): number {
    return Math.abs(d1.getTime() - d2.getTime());
  }
}
