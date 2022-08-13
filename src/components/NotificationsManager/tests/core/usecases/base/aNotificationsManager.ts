import { anything, instance, mock, when } from 'ts-mockito';

import { PostsService } from '../../../../main/core/domain/services/PostsService';

import { UuidNotificationIdGenerator } from '../../../../main/infra/UuidNotificationIdGenerator';
import { NotificationEventPublisherImpl } from '../../../../main/infra/NotificationEventPublisherImpl';
import { PostgresDonationPostNotificationRepository } from '../../../../main/infra/repositories/PostgresDonationPostNotificationRepository';
import { PostgresCallForHelpPostNotificationRepository } from '../../../../main/infra/repositories/PostgresCallForHelpPostNotificationRepository';
import { PostgresFamilyInNeedPostNotificationRepository } from '../../../../main/infra/repositories/PostgresFamilyInNeedPostNotificationRepository';
import { PostgresDonationRequestPostNotificationRepository } from '../../../../main/infra/repositories/PostgresDonationRequestPostNotificationRepository';

import { NotificationsManagerFacade } from '../../../../main/NotificationsManagerFacade';

import { EventBus } from '../../../../../_shared_/event-bus/EventBus';
import { UsersService } from '../../../../main/core/domain/services/UsersService';

interface Depedencies {
    postsService: PostsService;
    usersService: UsersService;
}

const aNotificationsManager = (dependencies?: Partial<Depedencies>) => {
    const usersServiceMock = mock<UsersService>();
    const postsServiceMock = mock<PostsService>();

    when(usersServiceMock.getIdsOfUsersInWilaya(anything())).thenResolve([]);
    when(usersServiceMock.getIdsOfAssociationsInWilaya(anything())).thenResolve([]);

    when(postsServiceMock.getPublishersOfDonationsThatMatch(anything())).thenResolve([]);
    when(postsServiceMock.getPublishersOfDonationRequestsThatMatch(anything())).thenResolve([]);

    return new NotificationsManagerFacade(
        dependencies?.postsService || instance(postsServiceMock),
        dependencies?.usersService || instance(usersServiceMock),
        new UuidNotificationIdGenerator(),
        new NotificationEventPublisherImpl(EventBus.getInstance()),
        new PostgresDonationPostNotificationRepository(),
        new PostgresCallForHelpPostNotificationRepository(),
        new PostgresFamilyInNeedPostNotificationRepository(),
        new PostgresDonationRequestPostNotificationRepository(),
    );
};

export { aNotificationsManager };