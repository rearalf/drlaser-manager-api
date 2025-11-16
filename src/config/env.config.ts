interface IEnvConfig {
  environment: 'development' | 'production' | 'test';
  port: number;
  myselfHost: string;

  allowedOrigins: string;

  db_host: string;
  db_port: number;
  db_user: string;
  db_password: string;
  db_name: string;
  db_type: 'postgres' | 'mysql' | 'mariadb' | 'sqlite' | 'mssql';

  user_email: string;
  user_password: string;
}

const EnvConfig = (): IEnvConfig => ({
  environment:
    (process.env.NODE_ENV as 'development' | 'production' | 'test') ||
    'development',
  port: process.env.PORT ? +process.env.PORT : 3000,
  myselfHost: process.env.MYSELF_HOST || 'http://localhost:3000',

  allowedOrigins: process.env.ALLOWED_ORIGINS || '*',

  db_host: process.env.DB_HOST || 'localhost',
  db_port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
  db_user: process.env.DB_USER || 'root',
  db_password: process.env.DB_PASSWORD || 'root',
  db_name: process.env.DB_NAME || 'database',
  db_type:
    (process.env.DB_TYPE as
      | 'postgres'
      | 'mysql'
      | 'mariadb'
      | 'sqlite'
      | 'mssql') || 'postgres',

  user_email: process.env.USER_EMAIL || 'admin@gmail.com',
  user_password: process.env.USER_PASSWORD || 'password',
});

export default EnvConfig;
