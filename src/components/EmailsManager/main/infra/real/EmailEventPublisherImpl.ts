import { EmailEventPublisher } from '../../core/domain/services/EmailEventPublisher';
import { EventBus } from '../../../../_shared_/event-bus/EventBus';
import { Email } from '../../core/domain/Email';

class EmailEventPublisherImpl implements EmailEventPublisher {
    constructor(private readonly eventBus: EventBus) {}

    publishAssociationApprovalEmailSent(email: Email, associationId: string) {
        this.eventBus.publish('ASSOCIATION_APPROVAL_EMAIL_SENT').withPayload({
            receiver: email.getReceiverEmail(),
            sender: email.getSenderEmail(),
            associationId,
        });
    }
}

export { EmailEventPublisherImpl };
