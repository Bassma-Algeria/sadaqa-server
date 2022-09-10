import { PostDto } from '../_common_/dtos/base/PostDto';

export interface GetPostsByPublisherUseCaseResponse {
    list: PostDto[];
}
