import { UsersManagerFacade } from './UsersManagerFacade';

import { WilayasServiceImpl } from './infra/real/WilayasServiceImpl';
import { PicturesManagerImpl } from './infra/real/PicturesManagerImpl';
import { UserEventPublisherImpl } from './infra/real/UserEventPublisherImpl';
import { UuidAccountIdGenerator } from './infra/real/UuidAccountIdGenerator';
import { BcryptPasswordEncryptor } from './infra/real/BcryptPasswordEncryptor';
import { InMemoryOnlineUserRepository } from './infra/real/InMemoryOnlineUserRepository';
import { PostgresRegularUserAccountRepository } from './infra/real/PostgresRegularUserAccountRepository';
import { PostgresAssociationAccountRepository } from './infra/real/PostgresAssociationAccountRepository';

import { InMemoryEventBus } from '../../EventBus/main/InMemoryEventBus';
import { MediaManagerConfiguration } from '../../MediaManager/main/MediaManagerConfiguration';
import { RegionsManagerConfiguration } from '../../RegionsManager/main/RegionsManagerConfiguration';

class UsersManagerConfiguration {
    static aUsersManager(): UsersManagerFacade {
        return new UsersManagerFacade(
            new WilayasServiceImpl(RegionsManagerConfiguration.aRegionsManagerFacade()),
            new PicturesManagerImpl(MediaManagerConfiguration.aMediaManagerFacade()),
            new BcryptPasswordEncryptor(),
            new UuidAccountIdGenerator(),
            new UserEventPublisherImpl(InMemoryEventBus.instance()),
            new InMemoryOnlineUserRepository(),
            new PostgresRegularUserAccountRepository(),
            new PostgresAssociationAccountRepository(),
        );
    }
}

export { UsersManagerConfiguration };
