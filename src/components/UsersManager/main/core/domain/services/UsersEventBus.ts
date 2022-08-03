import { UserId } from '../UserId';
import { AssociationDocs } from '../AssociationDocs';
import { AssociationAccount } from '../AssociationAccount';
import { RegularUserAccount } from '../RegularUserAccount';

export interface UsersEventBus {
    publishUserLoginEvent(userId: UserId): void;

    publishRegularUserRegisteredEvent(regularUser: RegularUserAccount): void;

    publishAssociationRegisteredEvent(payload: {
        associationAccount: AssociationAccount;
        associationDocs: AssociationDocs;
    }): void;
}
