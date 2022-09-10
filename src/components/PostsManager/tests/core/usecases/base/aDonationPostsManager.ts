import { anything, instance, mock, when } from 'ts-mockito';

import { UsersService } from '../../../../main/core/domain/services/UsersService';
import { WilayasService } from '../../../../main/core/domain/services/WilayasService';
import { PicturesManager } from '../../../../main/core/domain/services/PicturesManager';

import { FakePicturesManager } from '../../../../main/infra/fake/FakePicturesManager';
import { UuidPostIdGenerator } from '../../../../main/infra/real/UuidPostIdGenerator';

import { PostgresPostShareRepository } from '../../../../main/infra/real/PostgresPostRepository/PostgresPostShareRepository';
import { PostgresDonationPostRepository } from '../../../../main/infra/real/PostgresPostRepository/PostgresDonationPostRepository';
import { DonationPostEventPublisherImpl } from '../../../../main/infra/real/PostEventPublisherImpl/DonationPostEventPublisherImpl';
import { PostgresFavouritePostRepository } from '../../../../main/infra/real/PostgresPostRepository/PostgresFavouritePostRepository';

import { DonationPostsManagerFacade } from '../../../../main/core/DonationPostsManagerFacade';

import { InMemoryEventBus } from '../../../../../EventBus/main/InMemoryEventBus';

interface Dependencies {
    usersService: UsersService;
    wilayasService: WilayasService;
    picturesManager: PicturesManager;
}

const aDonationPostsManager = (dependencies?: Partial<Dependencies>) => {
    const mockUsersService = mock<UsersService>();
    const mockWilayasService = mock<WilayasService>();

    when(mockUsersService.isExist(anything())).thenResolve(true);
    when(mockUsersService.isActiveAssociation(anything())).thenResolve(true);

    when(mockWilayasService.isExist(anything())).thenResolve(true);

    return new DonationPostsManagerFacade(
        dependencies?.usersService || instance(mockUsersService),
        dependencies?.wilayasService || instance(mockWilayasService),
        dependencies?.picturesManager || new FakePicturesManager(),
        new UuidPostIdGenerator(),
        new PostgresPostShareRepository(),
        new PostgresDonationPostRepository(),
        new PostgresFavouritePostRepository(),
        new DonationPostEventPublisherImpl(InMemoryEventBus.instance()),
    );
};

export { aDonationPostsManager };
