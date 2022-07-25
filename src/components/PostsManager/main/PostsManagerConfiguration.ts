import { PostsManagerFacade } from './PostsManagerFacade';

import { PostsEventPublisherImpl } from './infra/real/PostsEventPublisherImpl';
import { UuidPostIdGenerator } from './infra/real/UuidPostIdGenerator';
import { UsersManagerUsersService } from './infra/real/UsersManagerUsersService';
import { RegionsManagerWilayasService } from './infra/real/RegionsManagerWilayasService';
import { MediaManagerPicturesUploader } from './infra/real/MediaManagerPicturesUploader';
import { PostgresDonationPostRepository } from './infra/real/PostgresDonationPostRepository';
import { PostgresFavouritePostRepository } from './infra/real/PostgresFavouritePostRepository';
import { PostgresCallForHelpPostRepository } from './infra/real/PostgresCallForHelpPostRepository';
import { PostgresFamilyInNeedPostRepository } from './infra/real/PostgresFamilyInNeedPostRepository';
import { PostgresDonationRequestPostRepository } from './infra/real/PostgresDonationRequestRepository';

import { MediaManagerConfiguration } from '../../MediaManager/main/MediaManagerConfiguration';
import { UsersManagerConfiguration } from '../../UsersManager/main/UsersManagerConfiguration';
import { RegionsManagerConfiguration } from '../../RegionsManager/main/RegionsManagerConfiguration';

import { EventBus } from '../../_shared_/event-bus/EventBus';

class PostsManagerConfiguration {
  static aPostsManagerFacade() {
    return new PostsManagerFacade(
      new UsersManagerUsersService(UsersManagerConfiguration.aUsersManagerFacade()),
      new RegionsManagerWilayasService(RegionsManagerConfiguration.aRegionsManagerFacade()),
      new MediaManagerPicturesUploader(MediaManagerConfiguration.aMediaManagerFacade()),
      new UuidPostIdGenerator(),
      new PostgresDonationPostRepository(),
      new PostsEventPublisherImpl(EventBus.getInstance()),
      new PostgresFamilyInNeedPostRepository(),
      new PostgresDonationRequestPostRepository(),
      new PostgresCallForHelpPostRepository(),
      new PostgresFavouritePostRepository(),
    );
  }
}

export { PostsManagerConfiguration };
