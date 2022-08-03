import { anything, instance, mock, when } from 'ts-mockito';

import { UsersService } from '../../../../main/core/domain/services/UsersService';
import { WilayasService } from '../../../../main/core/domain/services/WilayasService';
import { PicturesManager } from '../../../../main/core/domain/services/PicturesManager';

import { UuidPostIdGenerator } from '../../../../main/infra/real/UuidPostIdGenerator';
import { PostgresDonationRequestPostRepository } from '../../../../main/infra/real/PostgresPostRepository/PostgresDonationRequestRepository';
import { DonationRequestPostEventPublisherImpl } from '../../../../main/infra/real/PostEventPublisherImpl/DonationRequestPostEventPublisher';

import { FakePicturesManager } from '../../../../main/infra/fake/FakePicturesManager';

import { EventBus } from '../../../../../_shared_/event-bus/EventBus';
import { DonationRequestPostsManager } from '../../../../main/core/DonationRequestPostsManager';

interface Dependencies {
    usersService: UsersService;
    wilayasService: WilayasService;
    picturesManager: PicturesManager;
}

const aDonationRequestPostsManager = (dependencies?: Partial<Dependencies>) => {
    const mockUsersService = mock<UsersService>();
    const mockWilayasService = mock<WilayasService>();

    when(mockUsersService.isExist(anything())).thenResolve(true);
    when(mockUsersService.isActiveAssociation(anything())).thenResolve(true);

    when(mockWilayasService.isExist(anything())).thenResolve(true);

    return new DonationRequestPostsManager(
        dependencies?.usersService || instance(mockUsersService),
        dependencies?.wilayasService || instance(mockWilayasService),
        dependencies?.picturesManager || new FakePicturesManager(),
        new UuidPostIdGenerator(),
        new PostgresDonationRequestPostRepository(),
        new DonationRequestPostEventPublisherImpl(EventBus.getInstance()),
    );
};

export { aDonationRequestPostsManager };
