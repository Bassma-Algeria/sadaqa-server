import { UserId } from '../../core/domain/UserId';
import { UsersService } from '../../core/domain/services/UsersService';

import { UsersManagerFacade } from '../../../../UsersManager/main/UsersManagerFacade';

class UsersServiceImpl implements UsersService {
    constructor(private readonly usersManagerFacade: UsersManagerFacade) {}

    async isExist(publisherId: UserId): Promise<boolean> {
        const isRegularUserExist = await this.isRegularUserExist(publisherId);
        const isAssociationExist = await this.isAssociationExist(publisherId);

        return isAssociationExist || isRegularUserExist;
    }

    async isActiveAssociation(publisherId: UserId): Promise<boolean> {
        try {
            const { status } = await this.usersManagerFacade.getAssociationById({
                accountId: publisherId.value(),
            });

            return status === 'ACTIVE';
        } catch {
            return false;
        }
    }

    private async isRegularUserExist(id: UserId): Promise<boolean> {
        try {
            await this.usersManagerFacade.getRegularUserById({ accountId: id.value() });

            return true;
        } catch {
            return false;
        }
    }

    private async isAssociationExist(id: UserId): Promise<boolean> {
        try {
            await this.usersManagerFacade.getAssociationById({ accountId: id.value() });

            return true;
        } catch {
            return false;
        }
    }
}

export { UsersServiceImpl };
