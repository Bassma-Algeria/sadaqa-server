import { PostDto } from './base/PostDto';

export interface CallForHelpPostDto extends PostDto {
    readonly ccp: { number: string; key: string } | null;
    readonly baridiMobNumber: string | null;
}
