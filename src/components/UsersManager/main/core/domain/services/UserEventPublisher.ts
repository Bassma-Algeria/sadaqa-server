import { AccountId } from '../AccountId';
import { AssociationDocs } from '../AssociationDocs';
import { AssociationAccount } from '../AssociationAccount';
import { RegularUserAccount } from '../RegularUserAccount';

export interface UserEventPublisher {
    publishUserLoginEvent(accountId: AccountId): void;

    publishRegularUserRegisteredEvent(regularUser: RegularUserAccount): void;

    publishAssociationRegisteredEvent(payload: {
        associationAccount: AssociationAccount;
        associationDocs: AssociationDocs;
    }): void;
}
