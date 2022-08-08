import { UseCase } from '../UseCase';
import { UserBecameOnlineUseCaseRequest } from './UserBecameOnlineUseCaseRequest';

import { AccountId } from '../../domain/AccountId';

import { UserEventPublisher } from '../../domain/services/UserEventPublisher';
import { OnlineUserRepository } from '../../domain/services/OnlineUserRepository';

class UserBecameOnlineUseCase implements UseCase<UserBecameOnlineUseCaseRequest, void> {
    constructor(
        private readonly userEventPublisher: UserEventPublisher,
        private readonly onlineUserRepository: OnlineUserRepository,
    ) {}

    async handle(request: UserBecameOnlineUseCaseRequest): Promise<void> {
        const accountId = new AccountId(request.accountId);

        await this.onlineUserRepository.add(accountId);

        this.userEventPublisher.publishUserBecameOnlineEvent(accountId);
    }
}

export { UserBecameOnlineUseCase };