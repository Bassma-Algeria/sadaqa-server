import { PostShare } from '../../../core/domain/PostShare';
import { DonationPost } from '../../../core/domain/DonationPost';
import { DonationPostEventPublisher } from '../../../core/domain/services/PostEventPublisher/DonationPostEventPublisher';

import { EventBus } from '../../../../../EventBus/main/EventBus';

class DonationPostEventPublisherImpl implements DonationPostEventPublisher {
    constructor(private readonly eventBus: EventBus) {}

    publishPostCreated(post: DonationPost): void {
        this.eventBus.publish('DONATION_POST_CREATED').withPayload(this.toPayload(post));
    }

    publishPostUpdated(post: DonationPost): void {
        this.eventBus.publish('DONATION_POST_UPDATED').withPayload(this.toPayload(post));
    }

    publishPostDeleted(post: DonationPost): void {
        this.eventBus.publish('DONATION_POST_DELETED').withPayload(this.toPayload(post));
    }

    publishEnablingStatusToggled(post: DonationPost): void {
        this.eventBus
            .publish('DONATION_POST_ENABLING_STATUS_TOGGLED')
            .withPayload(this.toPayload(post));
    }

    publishPostShared(share: PostShare) {
        this.eventBus.publish('DONATION_POST_SHARED').withPayload({
            postId: share.state.postId,
            userId: share.state.userId,
            shareTime: share.state.createdAt,
        });
    }

    private toPayload(post: DonationPost) {
        return post.state;
    }
}

export { DonationPostEventPublisherImpl };
