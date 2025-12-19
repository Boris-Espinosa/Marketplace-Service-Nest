import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';

async function bootstrap() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  if (!process.env.REFRESH_JWT_SECRET) {
    throw new Error('REFRESH_JWT_SECRET environment variable is required');
  }

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
