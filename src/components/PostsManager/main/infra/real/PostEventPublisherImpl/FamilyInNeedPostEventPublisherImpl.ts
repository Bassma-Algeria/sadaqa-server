import { PostShare } from '../../../core/domain/PostShare';
import { FamilyInNeedPost } from '../../../core/domain/FamilyInNeedPost';
import { FamilyInNeedPostEventPublisher } from '../../../core/domain/services/PostEventPublisher/FamilyInNeedPostEventPublisher';

import { EventBus } from '../../../../../EventBus/main/EventBus';

class FamilyInNeedPostEventPublisherImpl implements FamilyInNeedPostEventPublisher {
    constructor(private readonly eventBus: EventBus) {}

    publishPostCreated(post: FamilyInNeedPost): void {
        this.eventBus.publish('FAMILY_IN_NEED_POST_CREATED').withPayload(this.toPayload(post));
    }

    publishPostUpdated(post: FamilyInNeedPost): void {
        this.eventBus.publish('FAMILY_IN_NEED_POST_UPDATED').withPayload(this.toPayload(post));
    }

    publishPostDeleted(post: FamilyInNeedPost): void {
        this.eventBus.publish('FAMILY_IN_NEED_POST_DELETED').withPayload(this.toPayload(post));
    }

    publishEnablingStatusToggled(post: FamilyInNeedPost): void {
        this.eventBus
            .publish('FAMILY_IN_NEED_POST_ENABLING_STATUS_TOGGLED')
            .withPayload(this.toPayload(post));
    }

    publishPostShared(share: PostShare) {
        this.eventBus.publish('FAMILY_IN_NEED_POST_SHARED').withPayload({
            postId: share.state.postId,
            userId: share.state.userId,
            shareTime: share.state.createdAt,
        });
    }

    private toPayload(post: FamilyInNeedPost) {
        return post.state;
    }
}

export { FamilyInNeedPostEventPublisherImpl };
