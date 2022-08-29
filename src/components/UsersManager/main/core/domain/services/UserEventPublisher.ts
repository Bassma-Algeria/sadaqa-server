import { Account } from '../Account';
import { AccountId } from '../AccountId';
import { AssociationDocs } from '../AssociationDocs';
import { AssociationAccount } from '../AssociationAccount';
import { RegularUserAccount } from '../RegularUserAccount';

export interface UserEventPublisher {
    publishUserLogin(account: Account): void;

    publishUserBecameOnlineEvent(accountId: AccountId): void;

    publishUserGoOffline(accountId: AccountId): void;

    publishAccountCredentialsEdited(account: Account): void;

    publishRegularUserRegistered(regularUser: RegularUserAccount): void;

    publishRegularUserAccountInfoEdited(regularUser: RegularUserAccount): void;

    publishAssociationAccountInfoEdited(account: AssociationAccount): void;

    publishAssociationRegistered(payload: {
        associationAccount: AssociationAccount;
        associationDocs: AssociationDocs;
    }): void;
}
