import { GetPostsListUseCaseRequest } from '../base/GetPostsListUseCaseRequest';

export interface GetDonationRequestPostsListUseCaseRequest extends GetPostsListUseCaseRequest {
    readonly category?: string;
}
