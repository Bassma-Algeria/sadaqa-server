import { UserId } from '../../core/domain/UserId';
import { UsersService } from '../../core/domain/services/UsersService';

import { UsersManagerFacade } from '../../../../UsersManager/main/UsersManagerFacade';

class UsersManagerUsersService implements UsersService {
    constructor(private readonly usersManagerFacade: UsersManagerFacade) {}

    async isExist(publisherId: UserId): Promise<boolean> {
        const isRegularUserExist = await this.isRegularUserExist(publisherId);
        const isAssociationExist = await this.isAssociationExist(publisherId);

        return isAssociationExist || isRegularUserExist;
    }

    async isActiveAssociation(publisherId: UserId): Promise<boolean> {
        try {
            const { active } = await this.usersManagerFacade.getAssociationById({
                associationId: publisherId.value(),
            });

            return active;
        } catch {
            return false;
        }
    }

    private async isRegularUserExist(id: UserId): Promise<boolean> {
        try {
            await this.usersManagerFacade.getRegularUserById({ regularUserId: id.value() });

            return true;
        } catch {
            return false;
        }
    }

    private async isAssociationExist(id: UserId): Promise<boolean> {
        try {
            await this.usersManagerFacade.getAssociationById({ associationId: id.value() });

            return true;
        } catch {
            return false;
        }
    }
}

export { UsersManagerUsersService };
