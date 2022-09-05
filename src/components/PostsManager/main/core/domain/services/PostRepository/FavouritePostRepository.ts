import { UserId } from '../../UserId';
import { PostId } from '../../PostId';
import { PostType } from '../../PostType';
import { FavouritePost } from '../../FavouritePost';

export interface FavouritePostRepository {
    save(post: FavouritePost): Promise<void>;

    delete(post: FavouritePost): Promise<void>;

    deleteMany(args: { postId: PostId; postType: PostType }): Promise<void>;

    findByUserId(userId: UserId): Promise<FavouritePost[]>;
}
