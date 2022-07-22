import { UseCase } from '../../UseCase';
import { GetFamiliesInNeedPostsUseCaseRequest } from './GetFamiliesInNeedPostsUseCaseRequest';
import { GetFamiliesInNeedPostsUseCaseResponse } from './GetFamiliesInNeedPostsUseCaseResponse';

import { WilayaNumber } from '../../../domain/WilayaNumber';

import {
  FamilyInNeedPostRepository,
  FindManyFilters,
} from '../../../domain/services/FamilyInNeedPostRepository';

import { FamilyInNeedPostDtoMapper } from '../FamilyInNeedPostDtoMapper';

class GetFamiliesInNeedPostsUseCase
  implements UseCase<GetFamiliesInNeedPostsUseCaseRequest, GetFamiliesInNeedPostsUseCaseResponse>
{
  private readonly PAGE_LIMIT = 20;

  constructor(private readonly familyInNeedPostRepository: FamilyInNeedPostRepository) {}

  async handle(
    request?: GetFamiliesInNeedPostsUseCaseRequest,
  ): Promise<GetFamiliesInNeedPostsUseCaseResponse> {
    const filters = this.getFiltersFrom(request);

    const familiesInNeed = await this.familyInNeedPostRepository.findMany(filters);
    const total = await this.familyInNeedPostRepository.count(filters);

    return {
      total,
      page: filters.page,
      end: this.isEndPage(filters.page, total),
      familiesInNeed: familiesInNeed.map(post => FamilyInNeedPostDtoMapper.toDto(post)),
    };
  }

  private getFiltersFrom(request?: GetFamiliesInNeedPostsUseCaseRequest): FindManyFilters {
    const page = request?.page || 1;
    const wilayaNumber = request?.wilayaNumber ? new WilayaNumber(request.wilayaNumber) : undefined;

    return { wilayaNumber, page, pageLimit: this.PAGE_LIMIT };
  }

  private isEndPage(page: number, total: number) {
    return page * this.PAGE_LIMIT >= total;
  }
}

export { GetFamiliesInNeedPostsUseCase };