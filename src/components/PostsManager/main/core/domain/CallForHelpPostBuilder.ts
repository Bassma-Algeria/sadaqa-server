import { CCP } from './CCP';
import { BaridiMobNumber } from './BaridiMobNumber';

import { PostBuilder } from './PostBuilder';
import { CallForHelpPost } from './CallForHelpPost';

class CallForHelpPostBuilder extends PostBuilder {
    private ccp: CCP | undefined;
    private baridiMobNumber: BaridiMobNumber | undefined;

    constructor(post?: CallForHelpPost) {
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
