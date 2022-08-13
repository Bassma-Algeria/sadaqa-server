import { UserId } from '../core/domain/UserId';

import { UsersService } from '../core/domain/services/UsersService';

import { UsersManagerFacade } from '../../../UsersManager/main/UsersManagerFacade';

class UsersServiceImpl implements UsersService {
    constructor(private readonly usersManager: UsersManagerFacade) {}

    async getIdsOfUsersInWilaya(wilayaNumber: number): Promise<UserId[]> {
        const associations = await this.usersManager.getAssociationsInWilaya({ wilayaNumber });
        const regularUsers = await this.usersManager.getRegularUsersInWilaya({ wilayaNumber });

        return [...associations, ...regularUsers].map(({ accountId }) => new UserId(accountId));
    }

    async getIdsOfAssociationsInWilaya(wilayaNumber: number): Promise<UserId[]> {
        const associations = await this.usersManager.getAssociationsInWilaya({ wilayaNumber });

        return associations.map(({ accountId }) => new UserId(accountId));
    }
}

export { UsersServiceImpl };