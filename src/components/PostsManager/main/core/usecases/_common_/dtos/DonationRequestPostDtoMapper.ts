import { PostDtoMapper } from './base/PostDtoMapper';

import { DonationRequestPostDto } from './DonationRequestPostDto';
import { DonationRequestPost } from '../../../domain/DonationRequestPost';

class DonationRequestPostDtoMapper extends PostDtoMapper<DonationRequestPost> {
    private static readonly instance = new DonationRequestPostDtoMapper();

    private constructor() {
        super();
    }

    static getInstance() {
        return this.instance;
    }

    toDto(post: DonationRequestPost): DonationRequestPostDto {
        return {
            ...super.toDto(post),

            category: post.category.value(),
        };
    }
}

export { DonationRequestPostDtoMapper };
