import { Module } from '@nestjs/common';

import { AdminService } from './services/admin.service';
import { AdminController } from './controllers/admin.controller';

import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';

import { RegionsService } from './services/regions.service';
import { RegionsController } from './controllers/regions.controller';

import { MessagesService } from './services/messages.service';
import { MessagesController } from './controllers/messages.controller';

import { NotificationsService } from './services/notifications.service';
import { NotificationsController } from './controllers/notifications.controller';

import { PostsService } from './services/PostsServices/posts.service';
import { PostsController } from './controllers/PostsControllers/posts.controller';

import { DonationPostsService } from './services/PostsServices/donation-posts.service';
import { DonationPostsController } from './controllers/PostsControllers/donation-posts.controller';

import { FavouritePostsService } from './services/PostsServices/favourite-posts.service';
import { FavouritePostsController } from './controllers/PostsControllers/favourite-posts.controller';

import { CallForHelpPostsService } from './services/PostsServices/call-for-help-posts.service';
import { CallForHelpPostsController } from './controllers/PostsControllers/call-for-help-posts.controller';

import { FamilyInNeedPostsService } from './services/PostsServices/family-in-need-posts.service';
import { FamilyInNeedPostsController } from './controllers/PostsControllers/family-in-need-posts.controller';

import { DonationRequestPostsService } from './services/PostsServices/donation-request-posts.service';
import { DonationRequestPostsController } from './controllers/PostsControllers/donation-request-posts.controller';

@Module({
    controllers: [
        UsersController,

        PostsController,
        DonationPostsController,
        CallForHelpPostsController,
        FamilyInNeedPostsController,
        DonationRequestPostsController,

        FavouritePostsController,

        AdminController,

        RegionsController,

        MessagesController,

        NotificationsController,
    ],
    providers: [
        UsersService,

        PostsService,
        DonationPostsService,
        CallForHelpPostsService,
        FamilyInNeedPostsService,
        DonationRequestPostsService,

        FavouritePostsService,

        AdminService,

        RegionsService,

        MessagesService,

        NotificationsService,
    ],
})
export class RestModule {}
