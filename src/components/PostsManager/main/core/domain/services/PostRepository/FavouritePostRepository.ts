import { UserId } from '../../UserId';
import { FavouritePost } from '../../FavouritePost';

export interface FavouritePostRepository {
    save(post: FavouritePost): Promise<void>;

    delete(post: FavouritePost): Promise<void>;

    findByUserId(userId: UserId): Promise<FavouritePost[]>;
}
