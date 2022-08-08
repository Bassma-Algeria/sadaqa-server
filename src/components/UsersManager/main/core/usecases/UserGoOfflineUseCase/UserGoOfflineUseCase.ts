import { UseCase } from '../UseCase';
import { UserGoOfflineUseCaseRequest } from './UserGoOfflineUseCaseRequest';

import { AccountId } from '../../domain/AccountId';

import { UserEventPublisher } from '../../domain/services/UserEventPublisher';
import { OnlineUserRepository } from '../../domain/services/OnlineUserRepository';

class UserGoOfflineUseCase implements UseCase<UserGoOfflineUseCaseRequest, void> {
    constructor(
        private readonly userEventPublisher: UserEventPublisher,
        private readonly onlineUserRepository: OnlineUserRepository,
    ) {}

    async handle(request: UserGoOfflineUseCaseRequest): Promise<void> {
        const accountId = new AccountId(request.accountId);

        await this.onlineUserRepository.remove(accountId);

        this.userEventPublisher.publishUserGoOfflineEvent(accountId);
    }
}

export { UserGoOfflineUseCase };