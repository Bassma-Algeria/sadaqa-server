import { FavouritePost } from '../FavouritePost';
import { UserId } from '../UserId';

export interface FavouritePostRepository {
  save(favouritePost: FavouritePost): Promise<void>;

  findByUserId(userId: UserId): Promise<FavouritePost[]>;

  delete(post: FavouritePost): Promise<void>;
}
