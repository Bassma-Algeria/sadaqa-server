import { UseCase } from '../../UseCase';
import { GetDonationsPostsUseCaseRequest } from './GetDonationsPostsUseCaseRequest';
import { GetDonationsPostsUseCaseResponse } from './GetDonationsPostsUseCaseResponse';

import { DonationPostDtoMapper } from '../DonationPostDtoMapper';

import { WilayaNumber } from '../../../domain/WilayaNumber';
import { DonationCategory } from '../../../domain/DonationCategory';
import { DonationPostRepository } from '../../../domain/services/DonationPostRepository';

class GetDonationsPostsUseCase
  implements UseCase<GetDonationsPostsUseCaseRequest, GetDonationsPostsUseCaseResponse>
{
  private readonly PAGE_LIMIT = 20;

  constructor(private readonly donationPostRepository: DonationPostRepository) {}

  async handle(
    request: GetDonationsPostsUseCaseRequest,
  ): Promise<GetDonationsPostsUseCaseResponse> {
    const filters = await this.getFiltersFrom(request);

    const donationsPosts = await this.donationPostRepository.findMany(filters);
    const total = await this.donationPostRepository.count(filters);

    return {
      total,
      page: filters.page,
      end: this.isEndPage(filters.page, total),
      donations: donationsPosts.map(post => DonationPostDtoMapper.toDto(post)),
    };
  }

  private async getFiltersFrom(request: GetDonationsPostsUseCaseRequest) {
    const category = new DonationCategory(request.category);

    const page = this.getPageFrom(request);
    const wilayaNumber = this.getWilayaNumberFrom(request);

    return { wilayaNumber, category, page, pageLimit: this.PAGE_LIMIT };
  }

  private getWilayaNumberFrom(request: GetDonationsPostsUseCaseRequest) {
    if (!request.wilayaNumber) return;

    return new WilayaNumber(request.wilayaNumber);
  }

  private getPageFrom(request: GetDonationsPostsUseCaseRequest): number {
    return request.page ? request.page : 1;
  }

  private isEndPage(page: number, total: number) {
    return page * this.PAGE_LIMIT >= total;
  }
}

export { GetDonationsPostsUseCase };

