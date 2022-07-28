import { PostId } from '../PostId';
import { WilayaNumber } from '../WilayaNumber';
import { DonationCategory } from '../DonationCategory';

import { DonationPost } from '../DonationPost';

export interface FindManyFilters {
  category: DonationCategory;
  page: number;
  pageLimit: number;
  wilayaNumber?: WilayaNumber;
}

export interface CountFilters {
  category: DonationCategory;
  wilayaNumber?: WilayaNumber;
}

export interface DonationPostRepository {
  save(donationPost: DonationPost): Promise<void>;

  update(donationPost: DonationPost): Promise<void>;

  findById(postId: PostId): Promise<DonationPost | undefined>;

  findMany(filters: FindManyFilters): Promise<DonationPost[]>;

  count(filters: CountFilters): Promise<number>;

  delete(id: PostId): Promise<void>;
}
