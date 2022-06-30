import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const bootstrapNestApp = async () => {
  const app = await NestFactory.create(AppModule);

  return app;
};

export { bootstrapNestApp };
