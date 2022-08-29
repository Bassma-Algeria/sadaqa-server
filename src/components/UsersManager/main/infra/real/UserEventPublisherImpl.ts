import { Account } from '../../core/domain/Account';
import { AssociationDocs } from '../../core/domain/AssociationDocs';
import { RegularUserAccount } from '../../core/domain/RegularUserAccount';
import { AssociationAccount } from '../../core/domain/AssociationAccount';

import { UserEventPublisher } from '../../core/domain/services/UserEventPublisher';

import { EventBus } from '../../../../_shared_/event-bus/EventBus';
import { AccountId } from '../../core/domain/AccountId';

class UserEventPublisherImpl implements UserEventPublisher {
    constructor(private readonly eventBus: EventBus) {}

    publishAssociationAccountInfoEdited(account: AssociationAccount): void {
        this.eventBus.publish('ASSOCIATION_ACCOUNT_INFO_EDITED').withPayload({
            accountId: account.getAccountId().value(),
            associationName: account.getAssociationName().value(),
            wilayaNumber: account.getWilayaNumber().value(),
            phoneNumber: account.getPhoneNumber().value(),
        });
    }

    publishRegularUserAccountInfoEdited(account: RegularUserAccount): void {
        this.eventBus.publish('REGULAR_USER_ACCOUNT_INFO_EDITED').withPayload({
            accountId: account.getAccountId().value(),
            firstName: account.getFirstName().value(),
            lastName: account.getLastName().value(),
            wilayaNumber: account.getWilayaNumber().value(),
            phoneNumber: account.getPhoneNumber().value(),
        });
    }

    publishAssociationRegistered(payload: {
        associationAccount: AssociationAccount;
        associationDocs: AssociationDocs;
    }): void {
        this.eventBus.publish('ASSOCIATION_REGISTERED').withPayload({
            accountId: payload.associationAccount.getAccountId().value(),
            associationName: payload.associationAccount.getAssociationName().value(),
            wilayaNumber: payload.associationAccount.getWilayaNumber().value(),
            phoneNumber: payload.associationAccount.getPhoneNumber().value(),
            email: payload.associationAccount.getEmail().value(),
            status: payload.associationAccount.getAccountStatus(),
            createdAt: payload.associationAccount.getCreationDate(),
            associationDocs: payload.associationDocs.docs(),
        });
    }

    publishRegularUserRegistered(regularUser: RegularUserAccount): void {
        this.eventBus.publish('REGULAR_USER_REGISTERED').withPayload({
            accountId: regularUser.getAccountId().value(),
            firstName: regularUser.getFirstName().value(),
            lastName: regularUser.getLastName().value(),
            wilayaNumber: regularUser.getWilayaNumber().value(),
            phoneNumber: regularUser.getPhoneNumber().value(),
            email: regularUser.getEmail().value(),
            status: regularUser.getAccountStatus(),
            createdAt: regularUser.getCreationDate(),
        });
    }

    publishUserLogin(account: Account): void {
        this.eventBus
            .publish('USER_LOGIN')
            .withPayload({ accountId: account.getAccountId().value() });
    }

    publishAccountCredentialsEdited(account: Account) {
        this.eventBus
            .publish('ACCOUNT_CREDENTIALS_EDITED')
            .withPayload({ accountId: account.getAccountId().value() });
    }

    publishUserBecameOnlineEvent(id: AccountId): void {
        this.eventBus.publish('USER_BECAME_ONLINE').withPayload({
            accountId: id.value(),
        });
    }

    publishUserGoOffline(id: AccountId): void {
        this.eventBus.publish('USER_GO_OFFLINE').withPayload({
            accountId: id.value(),
        });
    }
}

export { UserEventPublisherImpl };
