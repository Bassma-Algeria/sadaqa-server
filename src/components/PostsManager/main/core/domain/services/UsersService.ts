import { PublisherId } from '../PublisherId';

export interface UsersService {
  isExist(publisherId: PublisherId): Promise<boolean>;
  // isActiveAssociation(publisherId: PublisherId): Promise<boolean>;
}
