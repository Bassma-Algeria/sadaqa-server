import { PublisherId } from '../../core/domain/PublisherId';
import { UsersService } from '../../core/domain/services/UsersService';

import { UsersManagerFacade } from '../../../../UsersManager/main/UsersManagerFacade';

class UsersManagerUsersService implements UsersService {
  constructor(private readonly usersManagerFacade: UsersManagerFacade) {}

  async isExist(publisherId: PublisherId): Promise<boolean> {
    try {
      await this.usersManagerFacade.getUserById({ userId: publisherId.value() });

      return true;
    } catch {
      return false;
    }
  }
}

export { UsersManagerUsersService };
