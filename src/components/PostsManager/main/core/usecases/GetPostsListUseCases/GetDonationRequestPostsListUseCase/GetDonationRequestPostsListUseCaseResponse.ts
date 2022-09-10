import { DonationRequestPostDto } from '../../_common_/dtos/DonationRequestPostDto';
import { GetPostsListUseCaseResponse } from '../base/GetPostsListUseCaseResponse';

export interface GetDonationRequestPostsListUseCaseResponse
    extends GetPostsListUseCaseResponse<DonationRequestPostDto> {}
