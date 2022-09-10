import { UseCase } from '../UseCase';
import { SearchForPostsUseCaseRequest } from './SearchForPostsUseCaseRequest';
import { SearchForPostsUseCaseResponse } from './SearchForPostsUseCaseResponse';

import { Post } from '../../domain/Post';
import { WilayaNumber } from '../../domain/WilayaNumber';

import {
    PostRepository,
    PostRepositorySearchFilters,
} from '../../domain/services/PostRepository/base/PostRepository';

import { PostDtoMapper } from '../_common_/dtos/base/PostDtoMapper';
import { PostStatus } from '../../domain/PostStatus';

class SearchForPostsUseCase
    implements UseCase<SearchForPostsUseCaseRequest, SearchForPostsUseCaseResponse>
{
    private readonly PAGE_LIMIT = 20;
    private readonly TARGET_POSTS_STATUS = PostStatus.ENABLED;

    constructor(
        private readonly postDtoMapper: PostDtoMapper<Post>,
        private readonly postRepository: PostRepository<Post>,
    ) {}

    async handle(request: SearchForPostsUseCaseRequest): Promise<SearchForPostsUseCaseResponse> {
        const searchFilters = this.getSearchFiltersFrom(request);

        const posts = await this.postRepository.search(searchFilters);
        const total = await this.postRepository.searchCount(searchFilters);

        return {
            total,
            page: searchFilters.page,
            end: this.isEndPage(searchFilters.page, total),
            list: posts.map(this.postDtoMapper.toDto),
        };
    }

    private getSearchFiltersFrom(
        request: SearchForPostsUseCaseRequest,
    ): PostRepositorySearchFilters {
        const wilayaNumber = request.wilayaNumber
            ? new WilayaNumber(request.wilayaNumber)
            : undefined;

        const keyword = request.keyword?.trim().toLowerCase();
        const status = this.TARGET_POSTS_STATUS;
        const pageLimit = this.PAGE_LIMIT;
        const page = request.page || 1;

        return { keyword, page, status, pageLimit, wilayaNumber };
    }

    private isEndPage(page: number, total: number) {
        return page * this.PAGE_LIMIT >= total;
    }
}

export { SearchForPostsUseCase };
