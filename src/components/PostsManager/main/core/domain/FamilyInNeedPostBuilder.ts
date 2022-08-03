import { CCP } from './CCP';
import { BaridiMobNumber } from './BaridiMobNumber';

import { PostBuilder } from './PostBuilder';
import { FamilyInNeedPost } from './FamilyInNeedPost';

class FamilyInNeedPostBuilder extends PostBuilder {
    private ccp: CCP | undefined;
    private baridiMobNumber: BaridiMobNumber | undefined;

    constructor(post?: FamilyInNeedPost) {
        super(post);

        if (!post) return;

        this.ccp = post.ccp;
        this.baridiMobNumber = post.baridiMobNumber;
    }

    withCCP(ccp: CCP | undefined) {
        this.ccp = ccp;
        return this;
    }

    withBaridiMobNumber(baridiMobNumber: BaridiMobNumber | undefined) {
        this.baridiMobNumber = baridiMobNumber;
        return this;
    }

    build() {
        return new FamilyInNeedPost(
            this.postId,
            this.title,
            this.description,
            this.wilayaNumber,
            this.publisherId,
            this.pictures,
            this.createdAt,
            this.status,
            this.ccp,
            this.baridiMobNumber,
        );
    }
}

export { FamilyInNeedPostBuilder };
