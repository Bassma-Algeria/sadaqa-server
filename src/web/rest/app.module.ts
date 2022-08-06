import { Module } from '@nestjs/common';

import { AdminController } from './controllers/admin.controller';
import { UsersController } from './controllers/users.controller';
import { RegionsController } from './controllers/regions.controller';
import { MessagesController } from './controllers/messages.controller';
import { DonationPostsController } from './controllers/PostsControllers/donation-posts.controller';
import { FavouritePostsController } from './controllers/PostsControllers/favourite-posts.controller';
import { CallForHelpPostsController } from './controllers/PostsControllers/call-for-help-posts.controller';
import { FamilyInNeedPostsController } from './controllers/PostsControllers/family-in-need-posts.controller';
import { DonationRequestPostsController } from './controllers/PostsControllers/donation-request-posts.controller';

import { AdminService } from './services/admin.service';
import { UsersService } from './services/users.service';
import { RegionsService } from './services/regions.service';
import { MessagesService } from './services/messages.service';
import { DonationPostsService } from './services/PostsServices/donation-posts.service';
import { FavouritePostsService } from './services/PostsServices/favourite-posts.service';
import { CallForHelpPostsService } from './services/PostsServices/call-for-help-posts.service';
import { FamilyInNeedPostsService } from './services/PostsServices/family-in-need-posts.service';
import { DonationRequestPostsService } from './services/PostsServices/donation-request-posts.service';

@Module({
    imports: [],
    controllers: [
        UsersController,
        CallForHelpPostsController,
        DonationPostsController,
        DonationRequestPostsController,
        FamilyInNeedPostsController,
        FavouritePostsController,
        RegionsController,
        AdminController,
        MessagesController,
    ],
    providers: [
        UsersService,
        CallForHelpPostsService,
        DonationPostsService,
        DonationRequestPostsService,
        FamilyInNeedPostsService,
        FavouritePostsService,
        RegionsService,
        AdminService,
        MessagesService,
    ],
})
export class AppModule {}
