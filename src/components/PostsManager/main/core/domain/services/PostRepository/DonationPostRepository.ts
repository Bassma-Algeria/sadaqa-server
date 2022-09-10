import { DonationCategory } from '../../DonationCategory';

import { DonationPost } from '../../DonationPost';
import {
    PostRepository,
    PostRepositoryCountFilters,
    PostRepositoryFindManyFilters,
} from './base/PostRepository';

export interface DonationPostRepositoryFindManyFilters extends PostRepositoryFindManyFilters {
    category?: DonationCategory;
}

export interface DonationPostRepositoryCountFilters extends PostRepositoryCountFilters {
    category?: DonationCategory;
}

export interface DonationPostRepository extends PostRepository<DonationPost> {
    findMany(filters: DonationPostRepositoryFindManyFilters): Promise<DonationPost[]>;

    count(filters: DonationPostRepositoryCountFilters): Promise<number>;
}
