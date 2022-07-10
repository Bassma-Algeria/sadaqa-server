import { DonationPost } from '../../core/domain/DonationPost';
import { PostId } from '../../core/domain/PostId';
import { DonationPostRepository } from '../../core/domain/services/DonationPostRepository';

class InMemoryDonationPostRepository implements DonationPostRepository {
  private readonly store: Map<string, DonationPost> = new Map();

  async findById(id: PostId): Promise<DonationPost | undefined> {
    return this.store.get(id.value());
  }

  async save(donationPost: DonationPost): Promise<void> {
    this.store.set(donationPost.postId.value(), donationPost);
  }
}

export { InMemoryDonationPostRepository };
