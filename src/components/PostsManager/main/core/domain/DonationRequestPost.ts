import { Title } from './Title';
import { PostId } from './PostId';
import { UserId } from './UserId';
import { PostStatus } from './PostStatus';
import { Description } from './Description';
import { WilayaNumber } from './WilayaNumber';
import { DonationCategory } from './DonationCategory';

import { DonationRequestPostBuilder } from './DonationRequestPostBuilder';

import { Post } from './Post';
import { PostPictures } from './PostPictures';
import { PostType } from './PostType';

class DonationRequestPost extends Post {
    static aBuilder() {
        return new DonationRequestPostBuilder();
    }

    static aBuilderFrom(post: DonationRequestPost) {
        return new DonationRequestPostBuilder(post);
    }

    static fromState(state: Omit<DonationRequestPost['state'], 'type'>): DonationRequestPost {
        return new DonationRequestPost(
            new PostId(state.postId),
            new Title(state.title),
            new Description(state.description),
            new DonationCategory(state.category),
            new WilayaNumber(state.wilayaNumber),
            PostPictures.fromState(state.pictures),
            state.status as PostStatus,
            new UserId(state.publisherId),
            state.createdAt,
        );
    }

    protected postType = new PostType('donation-request');

    constructor(
        protected postId: PostId,
        protected title: Title,
        protected description: Description,
        protected category: DonationCategory,
        protected wilayaNumber: WilayaNumber,
        protected pictures: PostPictures,
        protected status: PostStatus,
        protected publisherId: UserId,
        protected createdAt: Date,
    ) {
        super(postId, title, description, wilayaNumber, publisherId, pictures, status, createdAt);
    }

    getCategory() {
        return this.category;
    }

    get state() {
        return {
            ...super.state,
            category: this.category.value() as string,
        } as const;
    }

    protected aBuilderFromThis() {
        return DonationRequestPost.aBuilderFrom(this);
    }
}

export { DonationRequestPost };
