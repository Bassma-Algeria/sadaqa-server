import { Title } from './Title';
import { PostId } from './PostId';
import { UserId } from './UserId';
import { Picture } from './Picture';
import { PostStatus } from './PostStatus';
import { Description } from './Description';
import { WilayaNumber } from './WilayaNumber';
import { DonationCategory } from './DonationCategory';

import { DonationRequestPostBuilder } from './DonationRequestPostBuilder';

import { Post } from './Post';

class DonationRequestPost extends Post {
    static aBuilder() {
        return new DonationRequestPostBuilder();
    }

    static aBuilderFrom(post: DonationRequestPost) {
        return new DonationRequestPostBuilder(post);
    }

    constructor(
        readonly postId: PostId,
        readonly title: Title,
        readonly description: Description,
        readonly category: DonationCategory,
        readonly wilayaNumber: WilayaNumber,
        readonly pictures: Picture[],
        readonly status: PostStatus,
        readonly publisherId: UserId,
        readonly createdAt: Date,
    ) {
        super(postId, title, description, wilayaNumber, publisherId, pictures, status, createdAt);
    }

    protected aBuilderFromThis() {
        return DonationRequestPost.aBuilderFrom(this);
    }
}

export { DonationRequestPost };