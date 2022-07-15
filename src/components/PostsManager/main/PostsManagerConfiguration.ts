import { PostsManagerFacade } from './PostsManagerFacade';

import { PostsEventBusImpli } from './infra/real/PostsEventBusImpli';
import { UuidPostIdGenerator } from './infra/real/UuidPostIdGenerator';
import { UsersManagerUsersService } from './infra/real/UsersManagerUsersService';
import { SystemClockDateTimeService } from './infra/real/SystemClockDateTimeService';
import { RegionsManagerWilayasService } from './infra/real/RegionsManagerWilayasService';
import { MediaManagerPicturesUploader } from './infra/real/MediaManagerPicturesUploader';
import { PostgresDonationPostRepository } from './infra/real/PostgresDonationPostRepository';

import { MediaManagerConfiguration } from '../../MediaManager/main/MediaManagerConfiguration';
import { UsersManagerConfiguration } from '../../UsersManager/main/UsersManagerConfiguration';
import { RegionsManagerConfiguration } from '../../RegionsManager/main/RegionsManagerConfiguration';

import { eventBus } from '../../_shared_/event-bus/EventBus';

class PostsManagerConfiguration {
  static aPostsManagerFacade() {
    return new PostsManagerFacade(
      new UsersManagerUsersService(UsersManagerConfiguration.aUsersManagerFacade()),
      new RegionsManagerWilayasService(RegionsManagerConfiguration.aRegionsManagerFacade()),
      new MediaManagerPicturesUploader(MediaManagerConfiguration.aMediaManagerFacade()),
      new UuidPostIdGenerator(),
      new PostgresDonationPostRepository(),
      new SystemClockDateTimeService(),
      new PostsEventBusImpli(eventBus),
    );
  }
}

export { PostsManagerConfiguration };
