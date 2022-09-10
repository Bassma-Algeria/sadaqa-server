import { UserId } from './UserId';
import { PostId } from './PostId';
import { PostType } from './PostType';

class PostShare {
    static fromState(state: PostShare['state']) {
        return new PostShare(
            new PostId(state.postId),
            new PostType(state.postType),
            state.userId ? new UserId(state.userId) : null,
            state.createdAt,
        );
    }

    constructor(
        private readonly postId: PostId,
        private readonly postType: PostType,
        private readonly userId: UserId | null,
        private readonly createdAt: Date,
    ) {}

    get state() {
        return {
            postId: this.postId.value(),
            postType: this.postType.value() as string,
            userId: this.userId ? this.userId.value() : null,
            createdAt: this.createdAt,
        };
    }
}

export { PostShare };
