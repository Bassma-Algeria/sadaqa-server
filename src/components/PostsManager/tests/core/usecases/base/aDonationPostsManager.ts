import { anything, instance, mock, when } from 'ts-mockito';

import { UsersService } from '../../../../main/core/domain/services/UsersService';
import { WilayasService } from '../../../../main/core/domain/services/WilayasService';
import { PicturesManager } from '../../../../main/core/domain/services/PicturesManager';

import { FakePicturesManager } from '../../../../main/infra/fake/FakePicturesManager';
import { UuidPostIdGenerator } from '../../../../main/infra/real/UuidPostIdGenerator';

import { PostgresDonationPostRepository } from '../../../../main/infra/real/PostgresPostRepository/PostgresDonationPostRepository';
import { DonationPostEventPublisherImpl } from '../../../../main/infra/real/PostEventPublisherImpl/DonationPostEventPublisherImpl';

import { DonationPostsManager } from '../../../../main/core/DonationPostsManager';

import { EventBus } from '../../../../../_shared_/event-bus/EventBus';

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

    return new DonationPostsManager(
        dependencies?.usersService || instance(mockUsersService),
        dependencies?.wilayasService || instance(mockWilayasService),
        dependencies?.picturesManager || new FakePicturesManager(),
        new UuidPostIdGenerator(),
        new PostgresDonationPostRepository(),
        new DonationPostEventPublisherImpl(EventBus.getInstance()),
    );
};

export { aDonationPostsManager };
