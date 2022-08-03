import { UsersManagerFacade } from './UsersManagerFacade';

import { UsersEventBusImpl } from './infra/real/UsersEventBusImpl';
import { UuidUserIdGenerator } from './infra/real/UuidUserIdGenerator';
import { BcryptPasswordEncryptor } from './infra/real/BcryptPasswordEncryptor';
import { RegionsManagerWilayasService } from './infra/real/RegionsManagerWilayasService';
import { PostgresUserAccountRepository } from './infra/real/PostgresUserAccountRepository';
import { PostgresAssociationAccountRespository } from './infra/real/PostgresAssociationAccountRespository';

import { RegionsManagerConfiguration } from '../../RegionsManager/main/RegionsManagerConfiguration';

import { EventBus } from '../../_shared_/event-bus/EventBus';

class UsersManagerConfiguration {
    static aUsersManagerFacade(): UsersManagerFacade {
        return new UsersManagerFacade(
            new PostgresUserAccountRepository(),
            new UuidUserIdGenerator(),
            new BcryptPasswordEncryptor(),
            new RegionsManagerWilayasService(RegionsManagerConfiguration.aRegionsManagerFacade()),
            new PostgresAssociationAccountRespository(),
            new UsersEventBusImpl(EventBus.getInstance()),
        );
    }
}

export { UsersManagerConfiguration };
