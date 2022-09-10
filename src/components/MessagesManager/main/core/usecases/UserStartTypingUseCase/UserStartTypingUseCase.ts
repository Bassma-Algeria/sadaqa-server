import { UseCase } from '../UseCase';
import { UserStartTypingUseCaseRequest } from './UserStartTypingUseCaseRequest';

import { UserId } from '../../domain/UserId';

import { TextMessageEventPublisher } from '../../domain/services/MessageEventPublisher/TextMessageEventPublisher';

class UserStartTypingUseCase implements UseCase<UserStartTypingUseCaseRequest, void> {
    constructor(private readonly messageEventPublisher: TextMessageEventPublisher) {}

    async handle(request: UserStartTypingUseCaseRequest): Promise<void> {
        this.messageEventPublisher.publishUserStartTypingEvent(
            new UserId(request.userId),
            new UserId(request.receiverId),
        );
    }
}

export { UserStartTypingUseCase };