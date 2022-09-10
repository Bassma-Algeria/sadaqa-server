import { anything, instance, mock, when } from 'ts-mockito';

import { UsersService } from '../../../../main/core/domain/services/UsersService';
import { WilayasService } from '../../../../main/core/domain/services/WilayasService';
import { PicturesManager } from '../../../../main/core/domain/services/PicturesManager';

import { UuidPostIdGenerator } from '../../../../main/infra/real/UuidPostIdGenerator';

import { PostgresPostShareRepository } from '../../../../main/infra/real/PostgresPostRepository/PostgresPostShareRepository';
import { PostgresFavouritePostRepository } from '../../../../main/infra/real/PostgresPostRepository/PostgresFavouritePostRepository';
import { FamilyInNeedPostEventPublisherImpl } from '../../../../main/infra/real/PostEventPublisherImpl/FamilyInNeedPostEventPublisherImpl';
import { PostgresFamilyInNeedPostRepository } from '../../../../main/infra/real/PostgresPostRepository/PostgresFamilyInNeedPostRepository';

import { FakePicturesManager } from '../../../../main/infra/fake/FakePicturesManager';

import { FamilyInNeedPostsManagerFacade } from '../../../../main/core/FamilyInNeedPostsManagerFacade';

import { InMemoryEventBus } from '../../../../../EventBus/main/InMemoryEventBus';

interface Dependencies {
    usersService: UsersService;
    wilayasService: WilayasService;
    picturesManager: PicturesManager;
}

const aFamilyInNeedPostsManager = (dependencies?: Partial<Dependencies>) => {
    const mockUsersService = mock<UsersService>();
    const mockWilayasService = mock<WilayasService>();

    when(mockUsersService.isExist(anything())).thenResolve(true);
    when(mockUsersService.isActiveAssociation(anything())).thenResolve(true);

    when(mockWilayasService.isExist(anything())).thenResolve(true);

    return new FamilyInNeedPostsManagerFacade(
        dependencies?.usersService || instance(mockUsersService),
        dependencies?.wilayasService || instance(mockWilayasService),
        dependencies?.picturesManager || new FakePicturesManager(),
        new UuidPostIdGenerator(),
        new PostgresPostShareRepository(),
        new PostgresFavouritePostRepository(),
        new PostgresFamilyInNeedPostRepository(),
        new FamilyInNeedPostEventPublisherImpl(InMemoryEventBus.instance()),
    );
};

export { aFamilyInNeedPostsManager };
