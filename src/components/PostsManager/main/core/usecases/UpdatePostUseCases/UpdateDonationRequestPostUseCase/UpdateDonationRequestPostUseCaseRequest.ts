import { UpdatePostUseCaseRequest } from '../base/UpdatePostUseCaseRequest';

export interface UpdateDonationRequestPostUseCaseRequest extends UpdatePostUseCaseRequest {
    readonly category: string;
}
