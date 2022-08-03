import { PostDto } from './base/PostDto';

export interface CallForHelpPostDto extends PostDto {
    readonly ccp?: string;
    readonly ccpKey?: string;
    readonly baridiMobNumber?: string;
}
