import { PostDto } from './base/PostDto';

export interface FamilyInNeedPostDto extends PostDto {
    readonly ccp?: string;
    readonly ccpKey?: string;
    readonly baridiMobNumber?: string;
}
