import { UseCase } from '../../UseCase';
import { GetFamilyInNeedPostsListUseCaseRequest } from './GetFamilyInNeedPostsListUseCaseRequest';
import { GetFamilyInNeedPostsListUseCaseResponse } from './GetFamilyInNeedPostsListUseCaseResponse';

import { FamilyInNeedPostRepository } from '../../../domain/services/PostRepository/FamilyInNeedPostRepository';

import { FamilyInNeedPostDtoMapper } from '../../_common_/dtos/FamilyInNeedPostDtoMapper';

import { GetPostsListUseCase } from '../base/GetPostsListUseCase';

class GetFamilyInNeedPostsListUseCase
    extends GetPostsListUseCase
    implements
        UseCase<GetFamilyInNeedPostsListUseCaseRequest, GetFamilyInNeedPostsListUseCaseResponse>
{
    constructor(private readonly familyInNeedPostRepository: FamilyInNeedPostRepository) {
        super();
    }

    async handle(
        request?: GetFamilyInNeedPostsListUseCaseRequest,
    ): Promise<GetFamilyInNeedPostsListUseCaseResponse> {
        const filters = this.getBasicFiltersFrom(request);

        const familiesInNeed = await this.familyInNeedPostRepository.findMany(filters);
        const total = await this.familyInNeedPostRepository.count(filters);

        return {
            total,
            page: filters.page,
            end: this.isEndPage(filters.page, total),
            list: familiesInNeed.map(post => FamilyInNeedPostDtoMapper.getInstance().toDto(post)),
        };
    }
}

export { GetFamilyInNeedPostsListUseCase };
