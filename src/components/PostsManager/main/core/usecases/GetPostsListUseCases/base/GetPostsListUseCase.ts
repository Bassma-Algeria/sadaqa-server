import { GetPostsListUseCaseRequest } from './GetPostsListUseCaseRequest';

import { WilayaNumber } from '../../../domain/WilayaNumber';

import { PostRepositoryFindManyFilters } from '../../../domain/services/PostRepository/base/PostRepository';

abstract class GetPostsListUseCase {
    private readonly PAGE_LIMIT = 20;

    protected getBasicFiltersFrom(
        request?: GetPostsListUseCaseRequest,
    ): PostRepositoryFindManyFilters {
        const page = request?.page || 1;
        const wilayaNumber = request?.wilayaNumber
            ? new WilayaNumber(request.wilayaNumber)
            : undefined;

        return { wilayaNumber, page, pageLimit: this.PAGE_LIMIT };
    }

    protected isEndPage(page: number, total: number) {
        return page * this.PAGE_LIMIT >= total;
    }
}

export { GetPostsListUseCase };
