import { DonationPostDto } from '../DonationPostDto';

export interface GetDonationsPostsUseCaseResponse {
  readonly donationsPosts: DonationPostDto[];
}