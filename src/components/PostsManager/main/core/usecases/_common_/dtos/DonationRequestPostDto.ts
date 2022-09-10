import { PostDto } from './base/PostDto';

export interface DonationRequestPostDto extends PostDto {
    readonly category: string;
}
