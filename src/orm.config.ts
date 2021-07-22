import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  username: 'timetracker',
  password: 'timetracker',
  port: 5432,
  host: 'localhost',
  database: 'timetracker',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};
