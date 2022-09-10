import { anything, instance, mock, when } from 'ts-mockito';

import { UsersService } from '../../../../main/core/domain/services/UsersService';
import { WilayasService } from '../../../../main/core/domain/services/WilayasService';
import { PicturesManager } from '../../../../main/core/domain/services/PicturesManager';

import { UuidPostIdGenerator } from '../../../../main/infra/real/UuidPostIdGenerator';
import { PostgresFavouritePostRepository } from '../../../../main/infra/real/PostgresPostRepository/PostgresFavouritePostRepository';
import { PostgresCallForHelpPostRepository } from '../../../../main/infra/real/PostgresPostRepository/PostgresCallForHelpPostRepository';
import { CallForHelpPostEventPublisherImpl } from '../../../../main/infra/real/PostEventPublisherImpl/CallForHelpPostEventPublisherImpl';

import { FakePicturesManager } from '../../../../main/infra/fake/FakePicturesManager';

import { CallForHelpPostsManagerFacade } from '../../../../main/core/CallForHelpPostsManagerFacade';
import { PostgresPostShareRepository } from '../../../../main/infra/real/PostgresPostRepository/PostgresPostShareRepository';
import { InMemoryEventBus } from '../../../../../EventBus/main/InMemoryEventBus';

interface Dependencies {
    usersService: UsersService;
    wilayasService: WilayasService;
    picturesManager: PicturesManager;
}

const aCallForHelpPostsManager = (dependencies?: Partial<Dependencies>) => {
    const mockUsersService = mock<UsersService>();
    const mockWilayasService = mock<WilayasService>();

    when(mockUsersService.isExist(anything())).thenResolve(true);
    when(mockUsersService.isActiveAssociation(anything())).thenResolve(true);

    when(mockWilayasService.isExist(anything())).thenResolve(true);

    return new CallForHelpPostsManagerFacade(
        dependencies?.usersService || instance(mockUsersService),
        dependencies?.wilayasService || instance(mockWilayasService),
        dependencies?.picturesManager || new FakePicturesManager(),

        new UuidPostIdGenerator(),
        new PostgresPostShareRepository(),
        new PostgresFavouritePostRepository(),
        new PostgresCallForHelpPostRepository(),
        new CallForHelpPostEventPublisherImpl(InMemoryEventBus.instance()),
    );
};

export { aCallForHelpPostsManager };
