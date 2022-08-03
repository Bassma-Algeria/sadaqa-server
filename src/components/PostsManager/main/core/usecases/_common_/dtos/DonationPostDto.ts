import { PostDto } from './base/PostDto';

export interface DonationPostDto extends PostDto {
    readonly category: string;
}
