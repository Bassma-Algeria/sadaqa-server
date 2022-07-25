import { DonationRequestPostDto } from '../../_common_/dtos/DonationRequestPostDto';

export interface GetDonationRequestsPostsUseCaseResponse {
  readonly total: number;
  readonly page: number;
  readonly end: boolean;
  readonly donationRequests: DonationRequestPostDto[];
}
