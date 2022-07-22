import { Module } from '@nestjs/common';

import { AdminController } from './controllers/admin.controller';
import { UsersController } from './controllers/users.controller';
import { PostsController } from './controllers/posts.controller';
import { RegionsController } from './controllers/regions.controller';

import { AdminService } from './services/admin.service';
import { UsersService } from './services/users.service';
import { PostsService } from './services/posts.service';
import { RegionsService } from './services/regions.service';

@Module({
  imports: [],
  controllers: [UsersController, PostsController, RegionsController, AdminController],
  providers: [UsersService, PostsService, RegionsService, AdminService],
})
export class AppModule {}
