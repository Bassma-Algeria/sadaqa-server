import { anything, instance, mock, when } from 'ts-mockito';

import { UsersService } from '../../../../main/core/domain/services/UsersService';

import { MessagesManagerFacade } from '../../../../main/MessagesManagerFacade';

import { UuidMessageIdGenerator } from '../../../../main/infra/real/UuidMessageIdGenerator';
import { PostgresTextMessageRepository } from '../../../../main/infra/real/PostgresTextMessageRepository';
import { TextMessageEventPublisherImpl } from '../../../../main/infra/real/TextMessageEventPublisherImpl';

import { InMemoryEventBus } from '../../../../../EventBus/main/InMemoryEventBus';

interface Dependencies {
    usersService: UsersService;
}

const aMessagesManager = (dependencies?: Partial<Dependencies>) => {
    const mockUsersService = mock<UsersService>();

    when(mockUsersService.isExist(anything())).thenResolve(true);

    return new MessagesManagerFacade(
        dependencies?.usersService || instance(mockUsersService),
        new UuidMessageIdGenerator(),
        new PostgresTextMessageRepository(),
        new TextMessageEventPublisherImpl(InMemoryEventBus.instance()),
    );
};

export { aMessagesManager };
