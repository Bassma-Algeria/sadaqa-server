import { EditAccountInfoUseCaseRequest } from '../base/EditAccountInfoUseCaseRequest';

export interface EditAssociationAccountInfoUseCaseRequest extends EditAccountInfoUseCaseRequest {
    readonly associationName: string;
}