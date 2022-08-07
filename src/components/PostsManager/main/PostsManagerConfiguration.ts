import { UuidPostIdGenerator } from './infra/real/UuidPostIdGenerator';
import { UsersServiceImpl } from './infra/real/UsersServiceImpl';
import { WilayasServiceImpl } from './infra/real/WilayasServiceImpl';
import { PicturesManagerImpl } from './infra/real/PicturesManagerImpl';
import { PostgresDonationPostRepository } from './infra/real/PostgresPostRepository/PostgresDonationPostRepository';
import { DonationPostEventPublisherImpl } from './infra/real/PostEventPublisherImpl/DonationPostEventPublisherImpl';
import { FavouritePostEventPublisherImpl } from './infra/real/PostEventPublisherImpl/FavouritePostEventPublisherImpl';
import { PostgresFavouritePostRepository } from './infra/real/PostgresPostRepository/PostgresFavouritePostRepository';
import { PostgresCallForHelpPostRepository } from './infra/real/PostgresPostRepository/PostgresCallForHelpPostRepository';
import { CallForHelpPostEventPublisherImpl } from './infra/real/PostEventPublisherImpl/CallForHelpPostEventPublisherImpl';
import { FamilyInNeedPostEventPublisherImpl } from './infra/real/PostEventPublisherImpl/FamilyInNeedPostEventPublisherImpl';
import { PostgresFamilyInNeedPostRepository } from './infra/real/PostgresPostRepository/PostgresFamilyInNeedPostRepository';
import { PostgresDonationRequestPostRepository } from './infra/real/PostgresPostRepository/PostgresDonationRequestRepository';
import { DonationRequestPostEventPublisherImpl } from './infra/real/PostEventPublisherImpl/DonationRequestPostEventPublisher';

import { DonationPostsManager } from './core/DonationPostsManager';
import { FavouritePostsManager } from './core/FavouritePostsManager';
import { CallForHelpPostsManager } from './core/CallForHelpPostsManager';
import { FamilyInNeedPostsManager } from './core/FamilyInNeedPostsManager';
import { DonationRequestPostsManager } from './core/DonationRequestPostsManager';

import { EventBus } from '../../_shared_/event-bus/EventBus';

import { MediaManagerConfiguration } from '../../MediaManager/main/MediaManagerConfiguration';
import { UsersManagerConfiguration } from '../../UsersManager/main/UsersManagerConfiguration';
import { RegionsManagerConfiguration } from '../../RegionsManager/main/RegionsManagerConfiguration';

class PostsManagerConfiguration {
    static aCallForHelpPostsManager() {
        return new CallForHelpPostsManager(
            new UsersServiceImpl(UsersManagerConfiguration.aUsersManagerFacade()),
            new WilayasServiceImpl(RegionsManagerConfiguration.aRegionsManagerFacade()),
            new PicturesManagerImpl(MediaManagerConfiguration.aMediaManagerFacade()),
            new UuidPostIdGenerator(),
            new PostgresCallForHelpPostRepository(),
            new CallForHelpPostEventPublisherImpl(EventBus.getInstance()),
        );
    }

    static aFamilyInNeedPostsManager() {
        return new FamilyInNeedPostsManager(
            new UsersServiceImpl(UsersManagerConfiguration.aUsersManagerFacade()),
            new WilayasServiceImpl(RegionsManagerConfiguration.aRegionsManagerFacade()),
            new PicturesManagerImpl(MediaManagerConfiguration.aMediaManagerFacade()),
            new UuidPostIdGenerator(),
            new PostgresFamilyInNeedPostRepository(),
            new FamilyInNeedPostEventPublisherImpl(EventBus.getInstance()),
        );
    }

    static aDonationPostsManager() {
        return new DonationPostsManager(
            new UsersServiceImpl(UsersManagerConfiguration.aUsersManagerFacade()),
            new WilayasServiceImpl(RegionsManagerConfiguration.aRegionsManagerFacade()),
            new PicturesManagerImpl(MediaManagerConfiguration.aMediaManagerFacade()),
            new UuidPostIdGenerator(),
            new PostgresDonationPostRepository(),
            new DonationPostEventPublisherImpl(EventBus.getInstance()),
        );
    }

    static aDonationRequestPostsManager() {
        return new DonationRequestPostsManager(
            new UsersServiceImpl(UsersManagerConfiguration.aUsersManagerFacade()),
            new WilayasServiceImpl(RegionsManagerConfiguration.aRegionsManagerFacade()),
            new PicturesManagerImpl(MediaManagerConfiguration.aMediaManagerFacade()),
            new UuidPostIdGenerator(),
            new PostgresDonationRequestPostRepository(),
            new DonationRequestPostEventPublisherImpl(EventBus.getInstance()),
        );
    }

    static aFavouritePostsManager() {
        return new FavouritePostsManager(
            new UsersServiceImpl(UsersManagerConfiguration.aUsersManagerFacade()),
            new PostgresDonationPostRepository(),
            new PostgresFavouritePostRepository(),
            new PostgresCallForHelpPostRepository(),
            new PostgresFamilyInNeedPostRepository(),
            new FavouritePostEventPublisherImpl(EventBus.getInstance()),
            new PostgresDonationRequestPostRepository(),
        );
    }
}

export { PostsManagerConfiguration };
