import { UseCase } from '../../UseCase';
import { GetCallForHelpPostsUseCaseRequest } from './GetCallForHelpPostsUseCaseRequest';
import { GetCallForHelpPostsUseCaseResponse } from './GetCallForHelpPostsUseCaseResponse';

import { WilayaNumber } from '../../../domain/WilayaNumber';

import { FindManyFilters } from '../../../domain/services/FamilyInNeedPostRepository';

import { CallForHelpPostDtoMapper } from '../CallForHelpPostDtoMapper';
import { CallForHelpPostRepository } from '../../../domain/services/CallForHelpPostRepository';

class GetCallForHelpPostsUseCase
  implements UseCase<GetCallForHelpPostsUseCaseRequest, GetCallForHelpPostsUseCaseResponse>
{
  private readonly PAGE_LIMIT = 20;

  constructor(private readonly callForHelpPostRepository: CallForHelpPostRepository) {}

  async handle(
    request?: GetCallForHelpPostsUseCaseRequest,
  ): Promise<GetCallForHelpPostsUseCaseResponse> {
    const filters = this.getFiltersFrom(request);

    const callForHelps = await this.callForHelpPostRepository.findMany(filters);
    const total = await this.callForHelpPostRepository.count(filters);

    return {
      total,
      page: filters.page,
      end: this.isEndPage(filters.page, total),
      callsForHelp: callForHelps.map(post => CallForHelpPostDtoMapper.toDto(post)),
    };
  }

  private getFiltersFrom(request?: GetCallForHelpPostsUseCaseRequest): FindManyFilters {
    const page = request?.page || 1;
    const wilayaNumber = request?.wilayaNumber ? new WilayaNumber(request.wilayaNumber) : undefined;

    return { wilayaNumber, page, pageLimit: this.PAGE_LIMIT };
  }

  private isEndPage(page: number, total: number) {
    return page * this.PAGE_LIMIT >= total;
  }
}

export { GetCallForHelpPostsUseCase };