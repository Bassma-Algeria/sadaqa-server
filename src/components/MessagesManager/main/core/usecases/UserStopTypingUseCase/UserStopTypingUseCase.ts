import { UseCase } from '../UseCase';
import { UserStopTypingUseCaseRequest } from './UserStopTypingUseCaseRequest';

import { UserId } from '../../domain/UserId';

import { TextMessageEventPublisher } from '../../domain/services/MessageEventPublisher/TextMessageEventPublisher';

class UserStopTypingUseCase implements UseCase<UserStopTypingUseCaseRequest, void> {
    constructor(private readonly messageEventPublisher: TextMessageEventPublisher) {}

    async handle(request: UserStopTypingUseCaseRequest): Promise<void> {
        this.messageEventPublisher.publishUserStopTypingEvent(
            new UserId(request.userId),
            new UserId(request.receiverId),
        );
    }
}

export { UserStopTypingUseCase };