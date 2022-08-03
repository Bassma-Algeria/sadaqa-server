import { Title } from './Title';
import { PostId } from './PostId';
import { UserId } from './UserId';
import { Picture } from './Picture';
import { PostStatus } from './PostStatus';
import { Description } from './Description';
import { WilayaNumber } from './WilayaNumber';
import { DonationCategory } from './DonationCategory';
import { DonationPostBuilder } from './DonationPostBuilder';

import { Post } from './Post';

class DonationPost extends Post {
    static aBuilder() {
        return new DonationPostBuilder();
    }

    static aBuilderFrom(post: DonationPost) {
        return new DonationPostBuilder(post);
    }

    constructor(
        readonly postId: PostId,
        readonly title: Title,
        readonly description: Description,
        readonly category: DonationCategory,
        readonly wilayaNumber: WilayaNumber,
        readonly pictures: Picture[],
        readonly publisherId: UserId,
        readonly status: PostStatus,
        readonly createdAt: Date,
    ) {
        super(postId, title, description, wilayaNumber, publisherId, pictures, status, createdAt);
    }

    protected aBuilderFromThis() {
        return DonationPost.aBuilderFrom(this);
    }
}

export { DonationPost };
