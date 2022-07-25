import { UseCase } from '../../UseCase';
import { GetDonationRequestsPostsUseCaseRequest } from './GetDonationRequestsPostsUseCaseRequest';
import { GetDonationRequestsPostsUseCaseResponse } from './GetDonationRequestsPostsUseCaseResponse';

import { DonationRequestPostDtoMapper } from '../../_common_/dtos/DonationRequestPostDtoMapper';

import { WilayaNumber } from '../../../domain/WilayaNumber';

import { DonationRequestPostRepository } from '../../../domain/services/DonationRequestPostRepository';

class GetDonationRequestsPostsUseCase
  implements
    UseCase<GetDonationRequestsPostsUseCaseRequest, GetDonationRequestsPostsUseCaseResponse>
{
  private readonly PAGE_LIMIT = 20;

  constructor(private readonly donationRequestPostRepository: DonationRequestPostRepository) {}

  async handle(
    request?: GetDonationRequestsPostsUseCaseRequest,
  ): Promise<GetDonationRequestsPostsUseCaseResponse> {
    const filters = await this.getFiltersFrom(request);

    const donationRequestPosts = await this.donationRequestPostRepository.findMany(filters);
    const total = await this.donationRequestPostRepository.count(filters);

    return {
      total,
      page: filters.page,
      end: this.isEndPage(filters.page, total),
      donationRequests: donationRequestPosts.map(post => DonationRequestPostDtoMapper.toDto(post)),
    };
  }

  private async getFiltersFrom(request?: GetDonationRequestsPostsUseCaseRequest) {
    const page = this.getPageFrom(request);
    const wilayaNumber = this.getWilayaNumberFrom(request);

    return { wilayaNumber, page, pageLimit: this.PAGE_LIMIT };
  }

  private getWilayaNumberFrom(request?: GetDonationRequestsPostsUseCaseRequest) {
    if (!request?.wilayaNumber) return undefined;

    return new WilayaNumber(request.wilayaNumber);
  }

  private getPageFrom(request?: GetDonationRequestsPostsUseCaseRequest): number {
    return request?.page ? request.page : 1;
  }

  private isEndPage(page: number, total: number) {
    return page * this.PAGE_LIMIT >= total;
  }
}

export { GetDonationRequestsPostsUseCase };

