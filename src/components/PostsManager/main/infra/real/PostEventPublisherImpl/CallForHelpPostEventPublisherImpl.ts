import { PostShare } from '../../../core/domain/PostShare';
import { CallForHelpPost } from '../../../core/domain/CallForHelpPost';
import { CallForHelpPostEventPublisher } from '../../../core/domain/services/PostEventPublisher/CallForHelpPostEventPublisher';

import { EventBus } from '../../../../../EventBus/main/EventBus';

class CallForHelpPostEventPublisherImpl implements CallForHelpPostEventPublisher {
    constructor(private readonly eventBus: EventBus) {}

    publishPostCreated(post: CallForHelpPost): void {
        this.eventBus.publish('CALL_FOR_HELP_POST_CREATED').withPayload(this.toPayload(post));
    }

    publishPostUpdated(post: CallForHelpPost): void {
        this.eventBus.publish('CALL_FOR_HELP_POST_UPDATED').withPayload(this.toPayload(post));
    }

    publishPostDeleted(post: CallForHelpPost): void {
        this.eventBus.publish('CALL_FOR_HELP_POST_DELETED').withPayload(this.toPayload(post));
    }

    publishEnablingStatusToggled(post: CallForHelpPost): void {
        this.eventBus
            .publish('CALL_FOR_HELP_POST_ENABLING_STATUS_TOGGLED')
            .withPayload(this.toPayload(post));
    }

    publishPostShared(share: PostShare) {
        this.eventBus.publish('CALL_FOR_HELP_POST_SHARED').withPayload({
            postId: share.state.postId,
            userId: share.state.userId,
            shareTime: share.state.createdAt,
        });
    }

    private toPayload(post: CallForHelpPost) {
        return post.state;
    }
}

export { CallForHelpPostEventPublisherImpl };
