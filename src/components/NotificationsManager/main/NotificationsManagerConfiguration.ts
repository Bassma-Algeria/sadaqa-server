import { NotificationsManagerFacade } from './NotificationsManagerFacade';

import { PostsServiceImpl } from './infra/PostsServiceImpl';
import { UsersServiceImpl } from './infra/UsersServiceImpl';
import { UuidNotificationIdGenerator } from './infra/UuidNotificationIdGenerator';
import { NotificationEventPublisherImpl } from './infra/NotificationEventPublisherImpl';
import { PostgresTextMessageNotificationRepository } from './infra/repositories/PostgresTextMessageNotificationRepository';
import { PostgresDonationPostNotificationRepository } from './infra/repositories/PostgresDonationPostNotificationRepository';
import { PostgresCallForHelpPostNotificationRepository } from './infra/repositories/PostgresCallForHelpPostNotificationRepository';
import { PostgresFamilyInNeedPostNotificationRepository } from './infra/repositories/PostgresFamilyInNeedPostNotificationRepository';
import { PostgresDonationRequestPostNotificationRepository } from './infra/repositories/PostgresDonationRequestPostNotificationRepository';

import { InMemoryEventBus } from '../../EventBus/main/InMemoryEventBus';
import { PostsManagerConfiguration } from '../../PostsManager/main/PostsManagerConfiguration';
import { UsersManagerConfiguration } from '../../UsersManager/main/UsersManagerConfiguration';

class NotificationsManagerConfiguration {
    static aNotificationsManager() {
        return new NotificationsManagerFacade(
            new PostsServiceImpl(
                PostsManagerConfiguration.aDonationPostsManager(),
                PostsManagerConfiguration.aDonationRequestPostsManager(),
            ),
            new UsersServiceImpl(UsersManagerConfiguration.aUsersManager()),
            new UuidNotificationIdGenerator(),
            new NotificationEventPublisherImpl(InMemoryEventBus.instance()),
            new PostgresTextMessageNotificationRepository(),
            new PostgresDonationPostNotificationRepository(),
            new PostgresCallForHelpPostNotificationRepository(),
            new PostgresFamilyInNeedPostNotificationRepository(),
            new PostgresDonationRequestPostNotificationRepository(),
        );
    }
}

export { NotificationsManagerConfiguration };
