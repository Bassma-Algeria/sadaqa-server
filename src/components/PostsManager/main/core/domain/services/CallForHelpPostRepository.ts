import { PostId } from '../PostId';
import { WilayaNumber } from '../WilayaNumber';
import { CallForHelpPost } from '../CallForHelpPost';

export interface FindManyFilters {
  page: number;
  pageLimit: number;
  wilayaNumber?: WilayaNumber;
}

export interface CountFilters {
  wilayaNumber?: WilayaNumber;
}

export interface CallForHelpPostRepository {
  save(post: CallForHelpPost): Promise<void>;

  update(post: CallForHelpPost): Promise<void>;

  findById(id: PostId): Promise<CallForHelpPost | undefined>;

  findMany(filters: FindManyFilters): Promise<CallForHelpPost[]>;

  count(filters?: CountFilters): Promise<number>;
}