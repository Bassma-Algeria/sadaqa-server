import { CCP } from './CCP';
import { Title } from './Title';
import { PostId } from './PostId';
import { UserId } from './UserId';
import { PostStatus } from './PostStatus';
import { Description } from './Description';
import { WilayaNumber } from './WilayaNumber';
import { BaridiMobNumber } from './BaridiMobNumber';

import { CallForHelpPostBuilder } from './CallForHelpPostBuilder';

import { Post } from './Post';
import { PostPictures } from './PostPictures';
import { PostType } from './PostType';

class CallForHelpPost extends Post {
    static aBuilder() {
        return new CallForHelpPostBuilder();
    }

    static aBuilderFrom(post: CallForHelpPost) {
        return new CallForHelpPostBuilder(post);
    }

    static fromState(state: Omit<CallForHelpPost['state'], 'type'>): CallForHelpPost {
        return new CallForHelpPost(
            new PostId(state.postId),
            new Title(state.title),
            new Description(state.description),
            new WilayaNumber(state.wilayaNumber),
            new UserId(state.publisherId),
            PostPictures.fromState(state.pictures),
            state.status as PostStatus,
            state.createdAt,
            state.ccp ? new CCP(state.ccp.number, state.ccp.key) : null,
            state.baridiMobNumber ? new BaridiMobNumber(state.baridiMobNumber) : null,
        );
    }

    protected postType = new PostType('call-for-help');

    constructor(
        protected postId: PostId,
        protected title: Title,
        protected description: Description,
        protected wilayaNumber: WilayaNumber,
        protected publisherId: UserId,
        protected pictures: PostPictures,
        protected status: PostStatus,
        protected createdAt: Date,
        protected ccp: CCP | null,
        protected baridiMobNumber: BaridiMobNumber | null,
    ) {
        super(postId, title, description, wilayaNumber, publisherId, pictures, status, createdAt);
    }

    getCCP() {
        return this.ccp;
    }

    getBaridiMobNumber() {
        return this.baridiMobNumber;
    }

    get state() {
        return {
            ...super.state,
            ccp: this.ccp ? { number: this.ccp.number(), key: this.ccp.key() } : null,
            baridiMobNumber: this.baridiMobNumber ? this.baridiMobNumber.value() : null,
        } as const;
    }

    protected aBuilderFromThis() {
        return CallForHelpPost.aBuilderFrom(this);
    }
}

export { CallForHelpPost };
