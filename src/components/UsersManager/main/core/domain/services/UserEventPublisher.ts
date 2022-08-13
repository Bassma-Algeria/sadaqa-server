import { AccountId } from '../AccountId';
import { AssociationDocs } from '../AssociationDocs';
import { AssociationAccount } from '../AssociationAccount';
import { RegularUserAccount } from '../RegularUserAccount';

export interface UserEventPublisher {
    publishUserLogin(accountId: AccountId): void;

    publishUserBecameOnlineEvent(accountId: AccountId): void;

    publishUserGoOffline(accountId: AccountId): void;

    publishAccountCredentialsEdited(accountId: AccountId): void;

    publishRegularUserRegistered(regularUser: RegularUserAccount): void;

    publishRegularUserAccountInfoEdited(regularUser: RegularUserAccount): void;

    publishAssociationAccountInfoEdited(account: AssociationAccount): void;

    publishAssociationRegistered(payload: {
        associationAccount: AssociationAccount;
        associationDocs: AssociationDocs;
    }): void;
}
