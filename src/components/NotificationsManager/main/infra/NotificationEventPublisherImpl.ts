import { DonationPostNotification } from '../core/domain/DonationPostNotification';
import { CallForHelpPostNotification } from '../core/domain/CallForHelpPostNotification';
import { FamilyInNeedPostNotification } from '../core/domain/FamilyInNeedPostNotification';
import { NotificationEventPublisher } from '../core/domain/services/NotificationEventPublisher';
import { DonationRequestPostNotification } from '../core/domain/DonationRequestPostNotification';

import { EventBus } from '../../../_shared_/event-bus/EventBus';

class NotificationEventPublisherImpl implements NotificationEventPublisher {
    constructor(private readonly eventBus: EventBus) {}

    newDonationPostNotificationCreated(notification: DonationPostNotification) {
        this.eventBus.publish('NEW_DONATION_POST_NOTIFICATION').withPayload({
            postId: notification.postId.value(),
            receiverId: notification.receiverId.value(),
            reason: notification.reason,
        });
    }

    newDonationRequestPostNotificationCreated(notification: DonationRequestPostNotification): void {
        this.eventBus.publish('NEW_DONATION_REQUEST_POST_NOTIFICATION').withPayload({
            postId: notification.postId.value(),
            receiverId: notification.receiverId.value(),
            reason: notification.reason,
        });
    }

    newCallForHelpPostNotificationCreated(notification: CallForHelpPostNotification): void {
        this.eventBus.publish('NEW_CALL_FOR_HELP_POST_NOTIFICATION').withPayload({
            postId: notification.postId.value(),
            receiverId: notification.receiverId.value(),
            reason: notification.reason,
        });
    }

    newFamilyInNeedPostNotificationCreated(notification: FamilyInNeedPostNotification): void {
        this.eventBus.publish('NEW_FAMILY_IN_NEED_POST_NOTIFICATION').withPayload({
            postId: notification.postId.value(),
            receiverId: notification.receiverId.value(),
            reason: notification.reason,
        });
    }
}

export { NotificationEventPublisherImpl };