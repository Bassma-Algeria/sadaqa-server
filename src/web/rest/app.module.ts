import { Module } from '@nestjs/common';

import { AdminController } from './controllers/admin.controller';
import { UsersController } from './controllers/users.controller';
import { RegionsController } from './controllers/regions.controller';
import { MessagesController } from './controllers/messages.controller';
import { NotificationsController } from './controllers/notifications.controller';
import { PostsController } from './controllers/PostsControllers/posts.controller';
import { DonationPostsController } from './controllers/PostsControllers/donation-posts.controller';
import { FavouritePostsController } from './controllers/PostsControllers/favourite-posts.controller';
import { CallForHelpPostsController } from './controllers/PostsControllers/call-for-help-posts.controller';
import { FamilyInNeedPostsController } from './controllers/PostsControllers/family-in-need-posts.controller';
import { DonationRequestPostsController } from './controllers/PostsControllers/donation-request-posts.controller';

import { AdminService } from './services/admin.service';
import { UsersService } from './services/users.service';
import { RegionsService } from './services/regions.service';
import { MessagesService } from './services/messages.service';
import { PostsService } from './services/PostsServices/posts.service';
import { NotificationsService } from './services/notifications.service';
import { DonationPostsService } from './services/PostsServices/donation-posts.service';
import { FavouritePostsService } from './services/PostsServices/favourite-posts.service';
import { CallForHelpPostsService } from './services/PostsServices/call-for-help-posts.service';
import { FamilyInNeedPostsService } from './services/PostsServices/family-in-need-posts.service';
import { DonationRequestPostsService } from './services/PostsServices/donation-request-posts.service';

import '../../components/eventsRegistration';

@Module({
    imports: [],
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
export class AppModule {}
