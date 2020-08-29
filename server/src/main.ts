import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {json} from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(json({limit:1000000}))
  await app.listen(3000);
}
bootstrap();
