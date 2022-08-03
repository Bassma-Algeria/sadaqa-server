import { PostDto } from '../../_common_/dtos/base/PostDto';

export interface GetPostsListUseCaseResponse<P extends PostDto> {
    readonly total: number;
    readonly page: number;
    readonly end: boolean;
    readonly list: P[];
}
