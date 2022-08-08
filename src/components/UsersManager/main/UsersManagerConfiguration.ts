import { UsersManagerFacade } from './UsersManagerFacade';

import { WilayasServiceImpl } from './infra/real/WilayasServiceImpl';
import { UserEventPublisherImpl } from './infra/real/UserEventPublisherImpl';
import { UuidAccountIdGenerator } from './infra/real/UuidAccountIdGenerator';
import { BcryptPasswordEncryptor } from './infra/real/BcryptPasswordEncryptor';
import { PostgresRegularUserAccountRepository } from './infra/real/PostgresRegularUserAccountRepository';
import { PostgresAssociationAccountRepository } from './infra/real/PostgresAssociationAccountRepository';

import { EventBus } from '../../_shared_/event-bus/EventBus';

import { RegionsManagerConfiguration } from '../../RegionsManager/main/RegionsManagerConfiguration';
import { InMemoryOnlineUserRepository } from './infra/real/InMemoryOnlineUserRepository';

class UsersManagerConfiguration {
    static aUsersManagerFacade(): UsersManagerFacade {
        return new UsersManagerFacade(
            new WilayasServiceImpl(RegionsManagerConfiguration.aRegionsManagerFacade()),
            new BcryptPasswordEncryptor(),
            new UuidAccountIdGenerator(),
            new UserEventPublisherImpl(EventBus.getInstance()),
            new InMemoryOnlineUserRepository(),
            new PostgresRegularUserAccountRepository(),
            new PostgresAssociationAccountRepository(),
        );
    }
}

export { UsersManagerConfiguration };
