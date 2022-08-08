import { AccountId } from '../../core/domain/AccountId';
import { AssociationDocs } from '../../core/domain/AssociationDocs';
import { RegularUserAccount } from '../../core/domain/RegularUserAccount';
import { AssociationAccount } from '../../core/domain/AssociationAccount';

import { UserEventPublisher } from '../../core/domain/services/UserEventPublisher';

import { EventBus } from '../../../../_shared_/event-bus/EventBus';

class UserEventPublisherImpl implements UserEventPublisher {
    constructor(private readonly eventBus: EventBus) {}

    publishAssociationAccountInfoEdited(account: AssociationAccount): void {
        this.eventBus.publish('ASSOCIATION_ACCOUNT_INFO_EDITED').withPayload({
            accountId: account.accountId.value(),
            associationName: account.associationName.value(),
            wilayaNumber: account.wilayaNumber.value(),
            phoneNumber: account.phoneNumber.value(),
        });
    }

    publishRegularUserAccountInfoEdited(regularUser: RegularUserAccount): void {
        this.eventBus.publish('REGULAR_USER_ACCOUNT_INFO_EDITED').withPayload({
            accountId: regularUser.accountId.value(),
            firstName: regularUser.firstName.value(),
            lastName: regularUser.lastName.value(),
            wilayaNumber: regularUser.wilayaNumber.value(),
            phoneNumber: regularUser.phoneNumber.value(),
        });
    }

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

    publishAccountCredentialsEdited(accountId: AccountId) {
        this.eventBus
            .publish('ACCOUNT_CREDENTIALS_EDITED')
            .withPayload({ accountId: accountId.value() });
    }

    publishUserBecameOnlineEvent(accountId: AccountId): void {
        this.eventBus.publish('USER_BECAME_ONLINE').withPayload({
            accountId: accountId.value(),
        });
    }

    publishUserGoOfflineEvent(accountId: AccountId): void {
        this.eventBus.publish('USER_GO_OFFLINE').withPayload({
            accountId: accountId.value(),
        });
    }
}

export { UserEventPublisherImpl };
