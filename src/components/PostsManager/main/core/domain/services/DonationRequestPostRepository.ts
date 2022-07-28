import { PostId } from '../PostId';
import { WilayaNumber } from '../WilayaNumber';
import { DonationRequestPost } from '../DonationRequestPost';

export interface FindManyFilters {
  page: number;
  pageLimit: number;
  wilayaNumber?: WilayaNumber;
}

export interface CountFilters {
  wilayaNumber?: WilayaNumber;
}

export interface DonationRequestPostRepository {
  save(post: DonationRequestPost): Promise<void>;

  update(post: DonationRequestPost): Promise<void>;

  findById(postId: PostId): Promise<DonationRequestPost | undefined>;

  findMany(filters: FindManyFilters): Promise<DonationRequestPost[]>;

  count(filters: CountFilters): Promise<number>;

  delete(id: PostId): Promise<void>;
}
