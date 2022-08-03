import { DonationCategory } from './DonationCategory';
import { DonationRequestPost } from './DonationRequestPost';

import { PostBuilder } from './PostBuilder';

class DonationRequestPostBuilder extends PostBuilder {
    private category!: DonationCategory;

    constructor(post?: DonationRequestPost) {
        super(post);

        if (!post) return;

        this.category = post.category;
    }

    withCategory(category: DonationCategory) {
        this.category = category;
        return this;
    }

    build() {
        return new DonationRequestPost(
            this.postId,
            this.title,
            this.description,
            this.category,
            this.wilayaNumber,
            this.pictures,
            this.status,
            this.publisherId,
            this.createdAt,
        );
    }
}

export { DonationRequestPostBuilder };
