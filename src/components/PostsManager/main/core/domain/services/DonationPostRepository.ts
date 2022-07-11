import { PostId } from '../PostId';
import { DonationPost } from '../DonationPost';

export interface DonationPostRepository {
  save(donationPost: DonationPost): Promise<void>;
  findById(postId: PostId): Promise<DonationPost | undefined>;
}
