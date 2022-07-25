import { UserId } from '../UserId';

export interface UsersService {
  isExist(id: UserId): Promise<boolean>;

  isActiveAssociation(id: UserId): Promise<boolean>;
}
