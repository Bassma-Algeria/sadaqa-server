import { CreatePostUseCaseRequest } from '../base/CreatePostUseCaseRequest';

export interface CreateDonationPostUseCaseRequest extends CreatePostUseCaseRequest {
    readonly category: string;
}
