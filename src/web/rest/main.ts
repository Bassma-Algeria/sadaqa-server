import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

const bootstrapNestApp = async () => {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('SADAQA REST API')
    .setVersion('1.0.0')
    .addTag('users')
    .addTag('posts')
    .addTag('notifications')
    .addTag('messages')
    .addTag('admin')
    .addTag('regions')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  return app;
};

export { bootstrapNestApp };
