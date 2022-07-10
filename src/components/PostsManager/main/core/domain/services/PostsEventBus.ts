import { DonationPost } from '../DonationPost';

export interface PostsEventBus {
  publishDonationPostCreated(donationPost: DonationPost): void;
}
