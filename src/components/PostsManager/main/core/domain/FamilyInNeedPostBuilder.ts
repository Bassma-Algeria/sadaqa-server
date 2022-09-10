import { CCP } from './CCP';
import { BaridiMobNumber } from './BaridiMobNumber';

import { PostBuilder } from './PostBuilder';
import { FamilyInNeedPost } from './FamilyInNeedPost';

class FamilyInNeedPostBuilder extends PostBuilder {
    private ccp: CCP | null = null;
    private baridiMobNumber: BaridiMobNumber | null = null;

    constructor(post?: FamilyInNeedPost) {
        super(post);

        if (!post) return;

        this.ccp = post.getCCP();
        this.baridiMobNumber = post.getBaridiMobNumber();
    }

    withCCP(ccp: CCP | null) {
        this.ccp = ccp;
        return this;
    }

    withBaridiMobNumber(baridiMobNumber: BaridiMobNumber | null) {
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
