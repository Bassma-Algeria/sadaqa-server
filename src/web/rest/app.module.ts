import { Module } from '@nestjs/common';

import { UsersController } from './controllers/users.controller';
import { PostsController } from './controllers/posts.controller';
import { RegionsController } from './controllers/regions.controller';

import { PostsService } from './services/posts.service';
import { UsersService } from './services/users.service';
import { RegionsService } from './services/regions.service';

@Module({
  imports: [],
  controllers: [UsersController, PostsController, RegionsController],
  providers: [UsersService, PostsService, RegionsService],
})
export class AppModule {}
