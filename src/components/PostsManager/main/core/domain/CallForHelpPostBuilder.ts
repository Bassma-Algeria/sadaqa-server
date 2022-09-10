import { CCP } from './CCP';
import { BaridiMobNumber } from './BaridiMobNumber';

import { PostBuilder } from './PostBuilder';
import { CallForHelpPost } from './CallForHelpPost';

class CallForHelpPostBuilder extends PostBuilder {
    private ccp: CCP | null = null;
    private baridiMobNumber: BaridiMobNumber | null = null;

    constructor(post?: CallForHelpPost) {
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
        return new CallForHelpPost(
            this.postId,
            this.title,
            this.description,
            this.wilayaNumber,
            this.publisherId,
            this.pictures,
            this.status,
            this.createdAt,
            this.ccp,
            this.baridiMobNumber,
        );
    }
}

export { CallForHelpPostBuilder };
