import { GetPostsListUseCaseRequest } from './GetPostsListUseCaseRequest';

import { PostStatus } from '../../../domain/PostStatus';
import { WilayaNumber } from '../../../domain/WilayaNumber';

import { PostRepositoryFindManyFilters } from '../../../domain/services/PostRepository/base/PostRepository';

abstract class GetPostsListUseCase {
    private readonly PAGE_LIMIT = 20;
    private readonly TARGET_POSTS_STATUS = PostStatus.ENABLED;

    protected getBasicFiltersFrom(
        request?: GetPostsListUseCaseRequest,
    ): PostRepositoryFindManyFilters {
        const page = request?.page || 1;
        const status = this.TARGET_POSTS_STATUS;

        const wilayaNumber = request?.wilayaNumber
            ? new WilayaNumber(request.wilayaNumber)
            : undefined;

        return { wilayaNumber, page, status, pageLimit: this.PAGE_LIMIT };
    }

    protected isEndPage(page: number, total: number) {
        return page * this.PAGE_LIMIT >= total;
    }
}

export { GetPostsListUseCase };
