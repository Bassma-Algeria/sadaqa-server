import { DonationPostDto } from '../../_common_/dtos/DonationPostDto';

export interface GetDonationsPostsUseCaseResponse {
  readonly total: number;
  readonly page: number;
  readonly end: boolean;
  readonly donations: DonationPostDto[];
}
