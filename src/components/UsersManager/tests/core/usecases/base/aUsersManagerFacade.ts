import { anything, instance, mock, when } from 'ts-mockito';

import { UsersManagerFacade } from '../../../../main/UsersManagerFacade';

import { WilayasService } from '../../../../main/core/domain/services/WilayasService';
import { PicturesManager } from '../../../../main/core/domain/services/PicturesManager';

import { FakePicturesManager } from '../../../../main/infra/fake/FakePicturesManager';

import { UserEventPublisherImpl } from '../../../../main/infra/real/UserEventPublisherImpl';
import { UuidAccountIdGenerator } from '../../../../main/infra/real/UuidAccountIdGenerator';
import { BcryptPasswordEncryptor } from '../../../../main/infra/real/BcryptPasswordEncryptor';
import { InMemoryOnlineUserRepository } from '../../../../main/infra/real/InMemoryOnlineUserRepository';
import { PostgresAssociationAccountRepository } from '../../../../main/infra/real/PostgresAssociationAccountRepository';
import { PostgresRegularUserAccountRepository } from '../../../../main/infra/real/PostgresRegularUserAccountRepository';

import { EventBus } from '../../../../../_shared_/event-bus/EventBus';

interface Dependencies {
    readonly wilayasService?: WilayasService;
    readonly picturesManager?: PicturesManager;
}

const aUsersManagerFacade = (dependencies?: Dependencies) => {
    const wilayasServiceMock = mock<WilayasService>();

    when(wilayasServiceMock.isExist(anything())).thenResolve(true);

    return new UsersManagerFacade(
        dependencies?.wilayasService || instance(wilayasServiceMock),
        dependencies?.picturesManager || new FakePicturesManager(),
        new BcryptPasswordEncryptor(),
        new UuidAccountIdGenerator(),
        new UserEventPublisherImpl(EventBus.getInstance()),
        new InMemoryOnlineUserRepository(),
        new PostgresRegularUserAccountRepository(),
        new PostgresAssociationAccountRepository(),
    );
};

export { aUsersManagerFacade };
