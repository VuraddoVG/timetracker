import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsDate()
  started_at: Date;

  @IsDate()
  updated_at: Date;

  @IsDate()
  completed_at: Date;

  @IsDate()
  due_to: Date;
}

export default CreateTaskDto;
