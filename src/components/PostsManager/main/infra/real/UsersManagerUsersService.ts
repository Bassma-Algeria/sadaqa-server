import { PublisherId } from '../../core/domain/PublisherId';
import { UsersService } from '../../core/domain/services/UsersService';

import { UsersManagerFacade } from '../../../../UsersManager/main/UsersManagerFacade';

class UsersManagerUsersService implements UsersService {
  constructor(private readonly usersManagerFacade: UsersManagerFacade) {}

  async isExist(publisherId: PublisherId): Promise<boolean> {
    try {
      await this.usersManagerFacade.getRegularUserById({ regularUserId: publisherId.value() });

      return true;
    } catch {
      return false;
    }
  }

  async isActiveAssociation(publisherId: PublisherId): Promise<boolean> {
    try {
      const { active } = await this.usersManagerFacade.getAssociationById({
        associationId: publisherId.value(),
      });

      return active;
    } catch {
      return false;
    }
  }
}

export { UsersManagerUsersService };
