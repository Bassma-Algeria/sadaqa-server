import { Post } from '../../../Post';
import { PostShare } from '../../../PostShare';

export interface PostEventPublisher<P extends Post> {
    publishPostCreated(post: P): void;

    publishPostUpdated(post: P): void;

    publishPostDeleted(post: P): void;

    publishEnablingStatusToggled(post: P): void;

    publishPostShared(share: PostShare): void;
}
