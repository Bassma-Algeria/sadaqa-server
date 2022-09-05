import { DonationPostDto } from './DonationPostDto';

import { DonationPost } from '../../../domain/DonationPost';
import { PostDtoMapper } from './base/PostDtoMapper';

class DonationPostDtoMapper extends PostDtoMapper<DonationPost> {
    private static readonly instance = new DonationPostDtoMapper();

    private constructor() {
        super();
    }

    static getInstance() {
        return this.instance;
    }

    toDto(post: DonationPost): DonationPostDto {
        return post.state;
    }
}

export { DonationPostDtoMapper };
