import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { EnvConfig, JoiValidationSchema, typeorm } from './config';
import { UserModule } from './user/user.module';
import { PersonModule } from './person/person.module';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { DbModule } from './db/db.module';

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
    DbModule,
    UserModule,
    PersonModule,
    DoctorModule,
    PatientModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
