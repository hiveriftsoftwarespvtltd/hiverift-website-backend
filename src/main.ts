// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const port = parseInt(configService.get<string>('PORT') ?? '4000', 10);

  app.set('trust proxy', 1);

  // Helmet with Cross-Origin Resource Policy allowed for static uploads
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginOpenerPolicy: { policy: 'unsafe-none' },
    }),
  );

  // Enable CORS for all ports and origins
  app.enableCors({
    origin: (origin, callback) => callback(null, true),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: '*',
  });

  // Resolve public/uploads path robustly
  const uploadDir = fs.existsSync(join(process.cwd(), 'package.json'))
    ? join(process.cwd(), 'public', 'uploads')
    : join(__dirname, '..', 'public', 'uploads');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Mount uploads on all possible proxy prefixes with and without trailing slash
  app.useStaticAssets(uploadDir, { prefix: '/api/v1/uploads/' });
  app.useStaticAssets(uploadDir, { prefix: '/api/v1/uploads' });
  app.useStaticAssets(uploadDir, { prefix: '/uploads/' });
  app.useStaticAssets(uploadDir, { prefix: '/uploads' });
  app.useStaticAssets(uploadDir, { prefix: '/hiverift_api/uploads/' });
  app.useStaticAssets(uploadDir, { prefix: '/hiverift_api/uploads' });

  app.useStaticAssets(join(process.cwd(), 'public'));

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      errorHttpStatusCode: 400,
    }),
  );

  await app.listen(port, '0.0.0.0');
  console.log(`🚀 API running at: http://localhost:${port}/api/v1`);
}

bootstrap();
