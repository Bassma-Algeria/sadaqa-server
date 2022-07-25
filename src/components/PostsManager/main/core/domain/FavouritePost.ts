import { UserId } from './UserId';
import { PostId } from './PostId';
import { PostType } from './PostType';

class FavouritePost {
  constructor(readonly userId: UserId, readonly postId: PostId, readonly postType: PostType) {}
}

export { FavouritePost };
