import { PostId } from '../../core/domain/PostId';
import { DonationPost } from '../../core/domain/DonationPost';

import {
  DonationPostRepository,
  FindManyFilters,
} from '../../core/domain/services/DonationPostRepository';

class InMemoryDonationPostRepository implements DonationPostRepository {
  private readonly store: Map<string, DonationPost> = new Map();

  async findById(id: PostId): Promise<DonationPost | undefined> {
    return this.store.get(id.value());
  }

  async save(donationPost: DonationPost): Promise<void> {
    this.store.set(donationPost.postId.value(), donationPost);
  }

  async findMany({
                   category,
                   wilayaNumber,
                   page,
                   pageLimit,
                 }: FindManyFilters): Promise<DonationPost[]> {
    const posts: DonationPost[] = [];

    for (const value of this.store.values()) {
      if (category.value() !== value.category.value()) continue;

      if (!wilayaNumber) {
        posts.push(value);
        continue;
      }

      if (wilayaNumber.value() === value.wilayaNumber.value()) {
        posts.push(value);
      }
    }

    page = page - 1;

    return posts.slice(page * pageLimit, page * pageLimit + pageLimit);
  }
}

export { InMemoryDonationPostRepository };
