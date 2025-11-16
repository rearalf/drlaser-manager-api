import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { EnvConfig, JoiValidationSchema, typeorm } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfig, typeorm],
      isGlobal: true,
      validationSchema: JoiValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        ...config.get('typeorm'),
        autoLoadEntities: true,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
