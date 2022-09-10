import { CCP } from './CCP';
import { Title } from './Title';
import { PostId } from './PostId';
import { UserId } from './UserId';
import { PostStatus } from './PostStatus';
import { Description } from './Description';
import { WilayaNumber } from './WilayaNumber';
import { BaridiMobNumber } from './BaridiMobNumber';

import { FamilyInNeedPostBuilder } from './FamilyInNeedPostBuilder';

import { Post } from './Post';
import { PostPictures } from './PostPictures';
import { PostType } from './PostType';

class FamilyInNeedPost extends Post {
    static aBuilder() {
        return new FamilyInNeedPostBuilder();
    }

    static aBuilderFrom(post: FamilyInNeedPost) {
        return new FamilyInNeedPostBuilder(post);
    }

    static fromState(state: Omit<FamilyInNeedPost['state'], 'type'>): FamilyInNeedPost {
        return new FamilyInNeedPost(
            new PostId(state.postId),
            new Title(state.title),
            new Description(state.description),
            new WilayaNumber(state.wilayaNumber),
            new UserId(state.publisherId),
            PostPictures.fromState(state.pictures),
            state.createdAt,
            state.status as PostStatus,
            state.ccp ? new CCP(state.ccp.number, state.ccp.key) : null,
            state.baridiMobNumber ? new BaridiMobNumber(state.baridiMobNumber) : null,
        );
    }

    protected postType = new PostType('family-in-need');

    constructor(
        protected postId: PostId,
        protected title: Title,
        protected description: Description,
        protected wilayaNumber: WilayaNumber,
        protected publisherId: UserId,
        protected pictures: PostPictures,
        protected createdAt: Date,
        protected status: PostStatus,
        protected ccp: CCP | null,
        protected baridiMobNumber: BaridiMobNumber | null,
    ) {
        super(postId, title, description, wilayaNumber, publisherId, pictures, status, createdAt);
    }

    get state() {
        return {
            ...super.state,
            ccp: this.ccp ? { number: this.ccp.number(), key: this.ccp.key() } : null,
            baridiMobNumber: this.baridiMobNumber ? this.baridiMobNumber.value() : null,
        } as const;
    }

    getCCP() {
        return this.ccp;
    }

    getBaridiMobNumber() {
        return this.baridiMobNumber;
    }

    protected aBuilderFromThis() {
        return FamilyInNeedPost.aBuilderFrom(this);
    }
}

export { FamilyInNeedPost };
