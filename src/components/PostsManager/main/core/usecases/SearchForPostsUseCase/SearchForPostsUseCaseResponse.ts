import { PostDto } from '../_common_/dtos/base/PostDto';

export interface SearchForPostsUseCaseResponse {
    page: number;
    total: number;
    end: boolean;
    list: PostDto[];
}
