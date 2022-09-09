import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

const bootstrapNestApp = async () => {
    const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
        .setTitle('SADAQA REST API')
        .setVersion('1.0.0')
        .addBearerAuth({ name: 'access-token', type: 'http' })
        .addTag('users')
        .addTag('posts')
        .addTag('admin')
        .addTag('regions')
        .addTag('messages')
        .addTag('notifications')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    return app;
};

export { bootstrapNestApp };
