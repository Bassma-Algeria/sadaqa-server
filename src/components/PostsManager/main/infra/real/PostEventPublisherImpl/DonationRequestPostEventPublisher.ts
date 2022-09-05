import { PostShare } from '../../../core/domain/PostShare';
import { DonationRequestPost } from '../../../core/domain/DonationRequestPost';
import { DonationRequestPostEventPublisher } from '../../../core/domain/services/PostEventPublisher/DonationRequestPostEventPublisher';

import { EventBus } from '../../../../../EventBus/main/EventBus';

class DonationRequestPostEventPublisherImpl implements DonationRequestPostEventPublisher {
    constructor(private readonly eventBus: EventBus) {}

    publishPostCreated(post: DonationRequestPost): void {
        this.eventBus.publish('DONATION_REQUEST_POST_CREATED').withPayload(this.toPayload(post));
    }

    publishPostUpdated(post: DonationRequestPost): void {
        this.eventBus.publish('DONATION_REQUEST_POST_UPDATED').withPayload(this.toPayload(post));
    }

    publishPostDeleted(post: DonationRequestPost): void {
        this.eventBus.publish('DONATION_REQUEST_POST_DELETED').withPayload(this.toPayload(post));
    }

    publishEnablingStatusToggled(post: DonationRequestPost): void {
        this.eventBus
            .publish('DONATION_REQUEST_POST_ENABLING_STATUS_TOGGLED')
            .withPayload(this.toPayload(post));
    }

    publishPostShared(share: PostShare) {
        this.eventBus.publish('DONATION_REQUEST_POST_SHARED').withPayload({
            postId: share.state.postId,
            userId: share.state.userId,
            shareTime: share.state.createdAt,
        });
    }

    private toPayload(post: DonationRequestPost) {
        return post.state;
    }
}

export { DonationRequestPostEventPublisherImpl };
