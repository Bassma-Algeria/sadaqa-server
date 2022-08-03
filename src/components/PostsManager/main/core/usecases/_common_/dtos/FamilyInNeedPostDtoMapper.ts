import { PostDtoMapper } from './base/PostDtoMapper';

import { FamilyInNeedPostDto } from './FamilyInNeedPostDto';

import { FamilyInNeedPost } from '../../../domain/FamilyInNeedPost';

class FamilyInNeedPostDtoMapper extends PostDtoMapper<FamilyInNeedPost> {
    private static readonly instance = new FamilyInNeedPostDtoMapper();

    private constructor() {
        super();
    }

    static getInstance() {
        return this.instance;
    }

    toDto(post: FamilyInNeedPost): FamilyInNeedPostDto {
        return {
            ...super.toDto(post),

            ccp: post.ccp?.number(),
            ccpKey: post.ccp?.key(),
            baridiMobNumber: post.baridiMobNumber?.value(),
        };
    }
}

export { FamilyInNeedPostDtoMapper };
