import { UsersServiceImpl } from './infra/real/UsersServiceImpl';
import { WilayasServiceImpl } from './infra/real/WilayasServiceImpl';
import { PicturesManagerImpl } from './infra/real/PicturesManagerImpl';
import { UuidPostIdGenerator } from './infra/real/UuidPostIdGenerator';
import { PostgresPostShareRepository } from './infra/real/PostgresPostRepository/PostgresPostShareRepository';
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

import { DonationPostsManagerFacade } from './core/DonationPostsManagerFacade';
import { FavouritePostsManagerFacade } from './core/FavouritePostsManagerFacade';
import { CallForHelpPostsManagerFacade } from './core/CallForHelpPostsManagerFacade';
import { FamilyInNeedPostsManagerFacade } from './core/FamilyInNeedPostsManagerFacade';
import { DonationRequestPostsManagerFacade } from './core/DonationRequestPostsManagerFacade';
import { GeneralPostOperationsManagerFacade } from './core/GeneralPostOperationsManagerFacade';

import { InMemoryEventBus } from '../../EventBus/main/InMemoryEventBus';
import { MediaManagerConfiguration } from '../../MediaManager/main/MediaManagerConfiguration';
import { UsersManagerConfiguration } from '../../UsersManager/main/UsersManagerConfiguration';
import { RegionsManagerConfiguration } from '../../RegionsManager/main/RegionsManagerConfiguration';

class PostsManagerConfiguration {
    static aCallForHelpPostsManager() {
        return new CallForHelpPostsManagerFacade(
            new UsersServiceImpl(UsersManagerConfiguration.aUsersManager()),
            new WilayasServiceImpl(RegionsManagerConfiguration.aRegionsManagerFacade()),
            new PicturesManagerImpl(MediaManagerConfiguration.aMediaManagerFacade()),
            new UuidPostIdGenerator(),
            new PostgresPostShareRepository(),
            new PostgresFavouritePostRepository(),
            new PostgresCallForHelpPostRepository(),
            new CallForHelpPostEventPublisherImpl(InMemoryEventBus.instance()),
        );
    }

    static aFamilyInNeedPostsManager() {
        return new FamilyInNeedPostsManagerFacade(
            new UsersServiceImpl(UsersManagerConfiguration.aUsersManager()),
            new WilayasServiceImpl(RegionsManagerConfiguration.aRegionsManagerFacade()),
            new PicturesManagerImpl(MediaManagerConfiguration.aMediaManagerFacade()),
            new UuidPostIdGenerator(),
            new PostgresPostShareRepository(),
            new PostgresFavouritePostRepository(),
            new PostgresFamilyInNeedPostRepository(),
            new FamilyInNeedPostEventPublisherImpl(InMemoryEventBus.instance()),
        );
    }

    static aDonationPostsManager() {
        return new DonationPostsManagerFacade(
            new UsersServiceImpl(UsersManagerConfiguration.aUsersManager()),
            new WilayasServiceImpl(RegionsManagerConfiguration.aRegionsManagerFacade()),
            new PicturesManagerImpl(MediaManagerConfiguration.aMediaManagerFacade()),
            new UuidPostIdGenerator(),
            new PostgresPostShareRepository(),
            new PostgresDonationPostRepository(),
            new PostgresFavouritePostRepository(),
            new DonationPostEventPublisherImpl(InMemoryEventBus.instance()),
        );
    }

    static aDonationRequestPostsManager() {
        return new DonationRequestPostsManagerFacade(
            new UsersServiceImpl(UsersManagerConfiguration.aUsersManager()),
            new WilayasServiceImpl(RegionsManagerConfiguration.aRegionsManagerFacade()),
            new PicturesManagerImpl(MediaManagerConfiguration.aMediaManagerFacade()),
            new UuidPostIdGenerator(),
            new PostgresPostShareRepository(),
            new PostgresFavouritePostRepository(),
            new PostgresDonationRequestPostRepository(),
            new DonationRequestPostEventPublisherImpl(InMemoryEventBus.instance()),
        );
    }

    static aFavouritePostsManager() {
        return new FavouritePostsManagerFacade(
            new UsersServiceImpl(UsersManagerConfiguration.aUsersManager()),
            new PostgresDonationPostRepository(),
            new PostgresFavouritePostRepository(),
            new PostgresCallForHelpPostRepository(),
            new PostgresFamilyInNeedPostRepository(),
            new FavouritePostEventPublisherImpl(InMemoryEventBus.instance()),
            new PostgresDonationRequestPostRepository(),
        );
    }

    static aGeneralPostOperationsManager() {
        return new GeneralPostOperationsManagerFacade(new PostgresPostShareRepository());
    }
}

export { PostsManagerConfiguration };
