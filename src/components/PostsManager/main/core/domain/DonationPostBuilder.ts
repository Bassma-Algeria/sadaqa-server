import { DonationPost } from './DonationPost';
import { DonationCategory } from './DonationCategory';

import { PostBuilder } from './PostBuilder';

class DonationPostBuilder extends PostBuilder {
    private category!: DonationCategory;

    constructor(post?: DonationPost) {
        super(post);

        if (!post) return;
        this.category = post.getCategory();
    }

    withCategory(category: DonationCategory) {
        this.category = category;
        return this;
    }

    build(): DonationPost {
        return new DonationPost(
            this.postId,
            this.title,
            this.description,
            this.category,
            this.wilayaNumber,
            this.pictures,
            this.publisherId,
            this.status,
            this.createdAt,
        );
    }
}

export { DonationPostBuilder };
