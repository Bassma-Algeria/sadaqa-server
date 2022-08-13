import { anything, instance, mock, when } from 'ts-mockito';

import { UsersService } from '../../../../main/core/domain/services/UsersService';

import { PostgresDonationPostRepository } from '../../../../main/infra/real/PostgresPostRepository/PostgresDonationPostRepository';
import { PostgresFavouritePostRepository } from '../../../../main/infra/real/PostgresPostRepository/PostgresFavouritePostRepository';
import { FavouritePostEventPublisherImpl } from '../../../../main/infra/real/PostEventPublisherImpl/FavouritePostEventPublisherImpl';
import { PostgresCallForHelpPostRepository } from '../../../../main/infra/real/PostgresPostRepository/PostgresCallForHelpPostRepository';
import { PostgresFamilyInNeedPostRepository } from '../../../../main/infra/real/PostgresPostRepository/PostgresFamilyInNeedPostRepository';
import { PostgresDonationRequestPostRepository } from '../../../../main/infra/real/PostgresPostRepository/PostgresDonationRequestRepository';

import { FavouritePostsManagerFacade } from '../../../../main/core/FavouritePostsManagerFacade';

import { EventBus } from '../../../../../_shared_/event-bus/EventBus';

interface Dependencies {
    usersService: UsersService;
}

const aFavouritePostsManager = (dependencies?: Partial<Dependencies>) => {
    const mockUsersService = mock<UsersService>();

    when(mockUsersService.isExist(anything())).thenResolve(true);
    when(mockUsersService.isActiveAssociation(anything())).thenResolve(true);

    return new FavouritePostsManagerFacade(
        dependencies?.usersService || instance(mockUsersService),
        new PostgresDonationPostRepository(),
        new PostgresFavouritePostRepository(),
        new PostgresCallForHelpPostRepository(),
        new PostgresFamilyInNeedPostRepository(),
        new FavouritePostEventPublisherImpl(EventBus.getInstance()),
        new PostgresDonationRequestPostRepository(),
    );
};

export { aFavouritePostsManager };
