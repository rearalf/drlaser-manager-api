import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const allowedOrigins: string = configService.get('ALLOWED_ORIGINS') ?? '*';

  app.enableCors({
    origin: allowedOrigins === '*' ? true : allowedOrigins.split(','),
    credentials: true,
  });
  app.setGlobalPrefix(`api/${configService.get('API_VERSION') ?? 'v1'}`);
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Dr Laser manager API')
      .setDescription('Documentation about backend')
      .setVersion(configService.get('BACKEND_VERSION') ?? '0.0.1')
      .build();

    const documentFactory = (): OpenAPIObject =>
      SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api-docs', app, documentFactory);
  }

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
