import { Email } from '../Email';

export interface EmailEventPublisher {
    publishAssociationApprovalEmailSent(email: Email, associationId: string): void;
}
