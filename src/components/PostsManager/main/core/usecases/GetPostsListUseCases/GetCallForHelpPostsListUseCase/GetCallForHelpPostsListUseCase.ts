import { UseCase } from '../../UseCase';
import { GetCallForHelpPostsListUseCaseRequest } from './GetCallForHelpPostsListUseCaseRequest';
import { GetCallForHelpPostsListUseCaseResponse } from './GetCallForHelpPostsListUseCaseResponse';

import { CallForHelpPostDtoMapper } from '../../_common_/dtos/CallForHelpPostDtoMapper';
import { CallForHelpPostRepository } from '../../../domain/services/PostRepository/CallForHelpPostRepository';
import { GetPostsListUseCase } from '../base/GetPostsListUseCase';

class GetCallForHelpPostsListUseCase
    extends GetPostsListUseCase
    implements
        UseCase<GetCallForHelpPostsListUseCaseRequest, GetCallForHelpPostsListUseCaseResponse>
{
    constructor(private readonly callForHelpPostRepository: CallForHelpPostRepository) {
        super();
    }

    async handle(
        request?: GetCallForHelpPostsListUseCaseRequest,
    ): Promise<GetCallForHelpPostsListUseCaseResponse> {
        const filters = this.getBasicFiltersFrom(request);

        const callForHelps = await this.callForHelpPostRepository.findMany(filters);
        const total = await this.callForHelpPostRepository.count(filters);

        return {
            total,
            page: filters.page,
            end: this.isEndPage(filters.page, total),
            list: callForHelps.map(post => CallForHelpPostDtoMapper.getInstance().toDto(post)),
        };
    }
}

export { GetCallForHelpPostsListUseCase };
