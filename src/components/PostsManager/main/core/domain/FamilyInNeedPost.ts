import { CCP } from './CCP';
import { Title } from './Title';
import { PostId } from './PostId';
import { UserId } from './UserId';
import { Picture } from './Picture';
import { PostStatus } from './PostStatus';
import { Description } from './Description';
import { WilayaNumber } from './WilayaNumber';
import { BaridiMobNumber } from './BaridiMobNumber';

import { FamilyInNeedPostBuilder } from './FamilyInNeedPostBuilder';

import { Post } from './Post';

class FamilyInNeedPost extends Post {
    static aBuilder() {
        return new FamilyInNeedPostBuilder();
    }

    static aBuilderFrom(post: FamilyInNeedPost) {
        return new FamilyInNeedPostBuilder(post);
    }

    constructor(
        readonly postId: PostId,
        readonly title: Title,
        readonly description: Description,
        readonly wilayaNumber: WilayaNumber,
        readonly publisherId: UserId,
        readonly pictures: Picture[],
        readonly createdAt: Date,
        readonly status: PostStatus,
        readonly ccp?: CCP,
        readonly baridiMobNumber?: BaridiMobNumber,
    ) {
        super(postId, title, description, wilayaNumber, publisherId, pictures, status, createdAt);
    }

    protected aBuilderFromThis() {
        return FamilyInNeedPost.aBuilderFrom(this);
    }
}

export { FamilyInNeedPost };
