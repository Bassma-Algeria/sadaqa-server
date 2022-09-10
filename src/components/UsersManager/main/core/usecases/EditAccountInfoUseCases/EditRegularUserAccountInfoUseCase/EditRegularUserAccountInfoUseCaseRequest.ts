import { EditAccountInfoUseCaseRequest } from '../base/EditAccountInfoUseCaseRequest';

export interface EditRegularUserAccountInfoUseCaseRequest extends EditAccountInfoUseCaseRequest {
    firstName: string;
    lastName: string;
}