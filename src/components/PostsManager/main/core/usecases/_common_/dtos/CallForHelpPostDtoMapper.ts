import { CallForHelpPostDto } from './CallForHelpPostDto';

import { PostDtoMapper } from './base/PostDtoMapper';

import { CallForHelpPost } from '../../../domain/CallForHelpPost';

class CallForHelpPostDtoMapper extends PostDtoMapper<CallForHelpPost> {
    private static readonly instance = new CallForHelpPostDtoMapper();

    private constructor() {
        super();
    }

    static getInstance() {
        return this.instance;
    }

    toDto(post: CallForHelpPost): CallForHelpPostDto {
        return {
            ...super.toDto(post),

            ccp: post.ccp?.number(),
            ccpKey: post.ccp?.key(),
            baridiMobNumber: post.baridiMobNumber?.value(),
        };
    }
}

export { CallForHelpPostDtoMapper };
