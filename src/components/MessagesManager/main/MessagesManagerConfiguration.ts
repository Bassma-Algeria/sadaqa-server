import { MessagesManagerFacade } from './MessagesManagerFacade';

import { UsersServiceImpl } from './infra/real/UsersServiceImpl';
import { UuidMessageIdGenerator } from './infra/real/UuidMessageIdGenerator';
import { PostgresTextMessageRepository } from './infra/real/PostgresTextMessageRepository';
import { TextMessageEventPublisherImpl } from './infra/real/TextMessageEventPublisherImpl';

import { InMemoryEventBus } from '../../EventBus/main/InMemoryEventBus';
import { UsersManagerConfiguration } from '../../UsersManager/main/UsersManagerConfiguration';

class MessagesManagerConfiguration {
    static aMessagesManager() {
        return new MessagesManagerFacade(
            new UsersServiceImpl(UsersManagerConfiguration.aUsersManager()),
            new UuidMessageIdGenerator(),
            new PostgresTextMessageRepository(),
            new TextMessageEventPublisherImpl(InMemoryEventBus.instance()),
        );
    }
}

export { MessagesManagerConfiguration };
