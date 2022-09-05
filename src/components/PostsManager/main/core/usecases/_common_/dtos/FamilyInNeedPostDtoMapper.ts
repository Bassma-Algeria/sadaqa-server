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
        return post.state;
    }
}

export { FamilyInNeedPostDtoMapper };
