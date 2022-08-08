import { AccountId } from '../AccountId';
import { AssociationDocs } from '../AssociationDocs';
import { AssociationAccount } from '../AssociationAccount';
import { RegularUserAccount } from '../RegularUserAccount';

export interface UserEventPublisher {
    publishUserLoginEvent(accountId: AccountId): void;

    publishUserBecameOnlineEvent(accountId: AccountId): void;

    publishUserGoOfflineEvent(accountId: AccountId): void;

    publishAccountCredentialsEdited(accountId: AccountId): void;

    publishRegularUserRegisteredEvent(regularUser: RegularUserAccount): void;

    publishRegularUserAccountInfoEdited(regularUser: RegularUserAccount): void;

    publishAssociationAccountInfoEdited(account: AssociationAccount): void;

    publishAssociationRegisteredEvent(payload: {
        associationAccount: AssociationAccount;
        associationDocs: AssociationDocs;
    }): void;
}
