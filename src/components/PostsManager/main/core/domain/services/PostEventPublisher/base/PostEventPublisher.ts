import { Post } from '../../../Post';

export interface PostEventPublisher<P extends Post> {
    publishPostCreated(post: P): void;

    publishPostUpdated(post: P): void;

    publishPostDeleted(post: P): void;

    publishEnablingStatusToggled(post: P): void;
}
