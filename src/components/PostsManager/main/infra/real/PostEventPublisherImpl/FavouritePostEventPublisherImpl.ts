import { FavouritePost } from '../../../core/domain/FavouritePost';
import { FavouritePostEventPublisher } from '../../../core/domain/services/PostEventPublisher/FavouritePostEventPublisher';

import { EventBus } from '../../../../../EventBus/main/EventBus';

class FavouritePostEventPublisherImpl implements FavouritePostEventPublisher {
    constructor(private readonly eventBus: EventBus) {}

    publishPostAddedToFavourite(post: FavouritePost): void {
        this.eventBus.publish('POST_ADDED_TO_FAVOURITE').withPayload(this.toPayload(post));
    }

    publishPostDeletedFromFavourite(post: FavouritePost): void {
        this.eventBus.publish('POST_DELETED_FROM_FAVOURITE').withPayload(this.toPayload(post));
    }

    private toPayload(post: FavouritePost) {
        return {
            postId: post.postId.value(),
            userId: post.userId.value(),
            postType: post.postType.value(),
        };
    }
}

export { FavouritePostEventPublisherImpl };
