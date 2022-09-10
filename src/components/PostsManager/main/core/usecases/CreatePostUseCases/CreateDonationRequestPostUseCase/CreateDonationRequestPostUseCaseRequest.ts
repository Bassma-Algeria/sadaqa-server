import { CreatePostUseCaseRequest } from '../base/CreatePostUseCaseRequest';

export interface CreateDonationRequestPostUseCaseRequest extends CreatePostUseCaseRequest {
    readonly category: string;
}
