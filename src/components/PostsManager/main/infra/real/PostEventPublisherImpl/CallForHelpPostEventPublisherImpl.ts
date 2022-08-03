import { CallForHelpPost } from '../../../core/domain/CallForHelpPost';
import { CallForHelpPostEventPublisher } from '../../../core/domain/services/PostEventPublisher/CallForHelpPostEventPublisher';

import { EventBus } from '../../../../../_shared_/event-bus/EventBus';

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

    private toPayload(post: CallForHelpPost) {
        return {
            postId: post.postId.value(),
            title: post.title.value(),
            description: post.description.value(),
            publisherId: post.publisherId.value(),
            wilayaNumber: post.wilayaNumber.value(),
            pictures: post.pictures.map(pic => pic.url()),
            ccp: post.ccp?.number(),
            status: post.status,
            ccpKey: post.ccp?.key(),
            baridiMobNumber: post.baridiMobNumber?.value(),
            createdAt: post.createdAt,
        };
    }
}

export { CallForHelpPostEventPublisherImpl };
