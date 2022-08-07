import { AccountId } from '../../core/domain/AccountId';
import { AssociationDocs } from '../../core/domain/AssociationDocs';
import { RegularUserAccount } from '../../core/domain/RegularUserAccount';
import { AssociationAccount } from '../../core/domain/AssociationAccount';

import { UserEventPublisher } from '../../core/domain/services/UserEventPublisher';

import { EventBus } from '../../../../_shared_/event-bus/EventBus';

class UserEventPublisherImpl implements UserEventPublisher {
    constructor(private readonly eventBus: EventBus) {}

    publishAssociationRegisteredEvent(payload: {
        associationAccount: AssociationAccount;
        associationDocs: AssociationDocs;
    }): void {
        this.eventBus.publish('ASSOCIATION_REGISTERED').withPayload({
            accountId: payload.associationAccount.accountId.value(),
            wilayaNumber: payload.associationAccount.wilayaNumber.value(),
            associationName: payload.associationAccount.associationName.value(),
            password: payload.associationAccount.password.value(),
            phoneNumber: payload.associationAccount.phoneNumber.value(),
            email: payload.associationAccount.email.value(),
            status: payload.associationAccount.status,
            createdAt: payload.associationAccount.createdAt,
            associationDocs: payload.associationDocs.docs(),
        });
    }

    publishRegularUserRegisteredEvent(regularUser: RegularUserAccount): void {
        this.eventBus.publish('REGULAR_USER_REGISTERED').withPayload({
            accountId: regularUser.accountId.value(),
            firstName: regularUser.firstName.value(),
            lastName: regularUser.lastName.value(),
            wilayaNumber: regularUser.wilayaNumber.value(),
            phoneNumber: regularUser.phoneNumber.value(),
            email: regularUser.email.value(),
            status: regularUser.status,
            password: regularUser.password.value(),
            createdAt: regularUser.createdAt,
        });
    }

    publishUserLoginEvent(accountId: AccountId): void {
        this.eventBus.publish('USER_LOGIN').withPayload({ accountId: accountId.value() });
    }
}

export { UserEventPublisherImpl };
