import { MessagesManagerFacade } from './MessagesManagerFacade';

import { UsersServiceImpl } from './infra/real/UsersServiceImpl';
import { UuidMessageIdGenerator } from './infra/real/UuidMessageIdGenerator';
import { PostgresTextMessageRepository } from './infra/real/PostgresTextMessageRepository';
import { TextMessageEventPublisherImpl } from './infra/real/TextMessageEventPublisherImpl';

import { EventBus } from '../../_shared_/event-bus/EventBus';

import { UsersManagerConfiguration } from '../../UsersManager/main/UsersManagerConfiguration';

class MessagesManagerConfiguration {
    static aMessagesManager() {
        return new MessagesManagerFacade(
            new UsersServiceImpl(UsersManagerConfiguration.aUsersManagerFacade()),
            new UuidMessageIdGenerator(),
            new PostgresTextMessageRepository(),
            new TextMessageEventPublisherImpl(EventBus.getInstance()),
        );
    }
}

export { MessagesManagerConfiguration };