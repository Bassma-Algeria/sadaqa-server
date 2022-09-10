import { UpdatePostUseCaseRequest } from '../base/UpdatePostUseCaseRequest';

export interface UpdateDonationPostUseCaseRequest extends UpdatePostUseCaseRequest {
    readonly category: string;
}
