import { Title } from './Title';
import { PostId } from './PostId';
import { UserId } from './UserId';
import { PostStatus } from './PostStatus';
import { Description } from './Description';
import { WilayaNumber } from './WilayaNumber';
import { PostPictures } from './PostPictures';
import { DonationCategory } from './DonationCategory';
import { DonationPostBuilder } from './DonationPostBuilder';

import { Post } from './Post';
import { PostType } from './PostType';

class DonationPost extends Post {
    static aBuilder() {
        return new DonationPostBuilder();
    }

    static aBuilderFrom(post: DonationPost) {
        return new DonationPostBuilder(post);
    }

    static fromState(state: Omit<DonationPost['state'], 'type'>): DonationPost {
        return new DonationPost(
            new PostId(state.postId),
            new Title(state.title),
            new Description(state.description),
            new DonationCategory(state.category),
            new WilayaNumber(state.wilayaNumber),
            PostPictures.fromState(state.pictures),
            new UserId(state.publisherId),
            state.status as PostStatus,
            state.createdAt,
        );
    }

    protected postType = new PostType('donation');

    constructor(
        protected postId: PostId,
        protected title: Title,
        protected description: Description,
        protected category: DonationCategory,
        protected wilayaNumber: WilayaNumber,
        protected pictures: PostPictures,
        protected publisherId: UserId,
        protected status: PostStatus,
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
        return DonationPost.aBuilderFrom(this);
    }
}

export { DonationPost };
