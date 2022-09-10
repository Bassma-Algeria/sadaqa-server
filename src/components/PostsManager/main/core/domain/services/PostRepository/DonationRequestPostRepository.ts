import { DonationRequestPost } from '../../DonationRequestPost';
import {
    PostRepository,
    PostRepositoryCountFilters,
    PostRepositoryFindManyFilters,
} from './base/PostRepository';
import { DonationCategory } from '../../DonationCategory';

export interface DonationRequestPostRepositoryFindManyFilters
    extends PostRepositoryFindManyFilters {
    category?: DonationCategory;
}

export interface DonationRequestPostRepositoryCountFilters extends PostRepositoryCountFilters {
    category?: DonationCategory;
}

export interface DonationRequestPostRepository extends PostRepository<DonationRequestPost> {
    findMany(filters: DonationRequestPostRepositoryFindManyFilters): Promise<DonationRequestPost[]>;
 
    count(filters: DonationRequestPostRepositoryCountFilters): Promise<number>;
}
