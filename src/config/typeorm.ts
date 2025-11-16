import { BaseDataSourceOptions } from 'typeorm/data-source/BaseDataSourceOptions';
import { DataSource, DataSourceOptions } from 'typeorm';
import { registerAs } from '@nestjs/config';
import 'dotenv/config';

type DB_TYPE = 'postgres' | 'mysql' | 'mariadb' | 'sqlite' | 'mssql';

const config: DataSourceOptions | BaseDataSourceOptions = {
  type: (process.env.DB_TYPE as DB_TYPE) || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'database',
  synchronize: false,
  migrationsRun: false,
  entities: ['dist/**/entities/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  logging: process.env.DB_LOGGING === 'true',
  extra: {
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: true }
        : undefined,
  },
};

export default registerAs('typeorm', () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);
