import { SendTextMessageUseCase } from './core/usecases/SendMessageUseCases/SendTextMessageUseCase/SendTextMessageUseCase';
import { SendTextMessageUseCaseRequest } from './core/usecases/SendMessageUseCases/SendTextMessageUseCase/SendTextMessageUseCaseRequest';

import { GetConversationUseCase } from './core/usecases/GetConversationUseCase/GetConversationUseCase';
import { GetConversationUseCaseRequest } from './core/usecases/GetConversationUseCase/GetConversationUseCaseRequest';

import { MakeMessageReadUseCase } from './core/usecases/MakeMessageReadUseCase/MakeMessageReadUseCase';
import { MakeMessageReadUseCaseRequest } from './core/usecases/MakeMessageReadUseCase/MakeMessageReadUseCaseRequest';

import { GetContactsListUseCase } from './core/usecases/GetContactsListUseCase/GetContactsListUseCase';
import { GetContactsListUseCaseRequest } from './core/usecases/GetContactsListUseCase/GetContactsListUseCaseRequest';

import { UserStartTypingUseCase } from './core/usecases/UserStartTypingUseCase/UserStartTypingUseCase';
import { UserStartTypingUseCaseRequest } from './core/usecases/UserStartTypingUseCase/UserStartTypingUseCaseRequest';

import { UserStopTypingUseCase } from './core/usecases/UserStopTypingUseCase/UserStopTypingUseCase';
import { UserStopTypingUseCaseRequest } from './core/usecases/UserStopTypingUseCase/UserStopTypingUseCaseRequest';

import { UsersService } from './core/domain/services/UsersService';
import { MessageIdGenerator } from './core/domain/services/MessageIdGenerator';
import { TextMessageRepository } from './core/domain/services/MessageRepository/TextMessageRepository';
import { TextMessageEventPublisher } from './core/domain/services/MessageEventPublisher/TextMessageEventPublisher';

class MessagesManagerFacade {
    constructor(
        private readonly usersService: UsersService,
        private readonly messageIdGenerator: MessageIdGenerator,
        private readonly textMessageRepository: TextMessageRepository,
        private readonly textMessageEventPublisher: TextMessageEventPublisher,
    ) {}

    sendTextMessage(request: SendTextMessageUseCaseRequest) {
        return new SendTextMessageUseCase(
            this.usersService,
            this.messageIdGenerator,
            this.textMessageRepository,
            this.textMessageEventPublisher,
        ).handle(request);
    }

    getConversation(request: GetConversationUseCaseRequest) {
        return new GetConversationUseCase(this.textMessageRepository).handle(request);
    }

    makeMessageRead(request: MakeMessageReadUseCaseRequest) {
        return new MakeMessageReadUseCase(
            this.textMessageRepository,
            this.textMessageEventPublisher,
        ).handle(request);
    }

    getContactsList(request: GetContactsListUseCaseRequest) {
        return new GetContactsListUseCase(this.textMessageRepository).handle(request);
    }

    userStartTyping(request: UserStartTypingUseCaseRequest) {
        return new UserStartTypingUseCase(this.textMessageEventPublisher).handle(request);
    }

    userStopTyping(request: UserStopTypingUseCaseRequest) {
        return new UserStopTypingUseCase(this.textMessageEventPublisher).handle(request);
    }
}

export { MessagesManagerFacade };