import { DonationPostDto } from '../../_common_/dtos/DonationPostDto';
import { GetPostsListUseCaseResponse } from '../base/GetPostsListUseCaseResponse';

export interface GetDonationPostsListUseCaseResponse
    extends GetPostsListUseCaseResponse<DonationPostDto> {}
