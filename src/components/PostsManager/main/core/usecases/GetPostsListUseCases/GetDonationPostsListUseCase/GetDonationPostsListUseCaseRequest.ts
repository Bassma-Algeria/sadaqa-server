import { GetPostsListUseCaseRequest } from '../base/GetPostsListUseCaseRequest';

export interface GetDonationPostsListUseCaseRequest extends GetPostsListUseCaseRequest {
    readonly category?: string;
}
