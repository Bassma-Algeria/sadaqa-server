import { UseCase } from '../UseCase';
import { GetOnlineUsersListUseCaseResponse } from './GetOnlineUsersListUseCaseResponse';

import { OnlineUserRepository } from '../../domain/services/OnlineUserRepository';

class GetOnlineUsersListUseCase implements UseCase<void, GetOnlineUsersListUseCaseResponse> {
    constructor(private readonly onlineUserRepository: OnlineUserRepository) {}

    async handle(): Promise<GetOnlineUsersListUseCaseResponse> {
        const idsList = await this.onlineUserRepository.getAll();

        return { list: idsList.map(id => id.value()) } as any;
    }
}

export { GetOnlineUsersListUseCase };