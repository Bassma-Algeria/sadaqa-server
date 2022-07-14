import { UseCase } from '../UseCase';
import { GetDonationsPostsUseCaseRequest } from './GetDonationsPostsUseCaseRequest';
import { GetDonationsPostsUseCaseResponse } from './GetDonationsPostsUseCaseResponse';

import { DonationPostDtoMapper } from '../DonationPostDtoMapper';

import { WilayaNumber } from '../../domain/WilayaNumber';
import { DonationCategory } from '../../domain/DonationCategory';

import { WilayasService } from '../../domain/services/WilayasService';
import { DonationPostRepository } from '../../domain/services/DonationPostRepository';

import { InvalidWilayaNumberException } from '../../domain/exceptions/InvalidWilayaNumberException';

class GetDonationsPostsUseCase
  implements UseCase<GetDonationsPostsUseCaseRequest, GetDonationsPostsUseCaseResponse> {
  private readonly POSTS_LIMIT = 20;

  constructor(
    private readonly donationPostRepository: DonationPostRepository,
    private readonly wilayasService: WilayasService,
  ) {
  }

  async handle(
    request: GetDonationsPostsUseCaseRequest,
  ): Promise<GetDonationsPostsUseCaseResponse> {
    const filters = await this.getFiltersFrom(request);

    const donationsPosts = await this.donationPostRepository.findMany(filters);

    return { donationsPosts: donationsPosts.map(post => DonationPostDtoMapper.toDto(post)) };
  }

  private async getFiltersFrom(request: GetDonationsPostsUseCaseRequest) {
    const category = new DonationCategory(request.category);

    const page = this.getPageFrom(request);
    const wilayaNumber = await this.validateAndGetWilayaNumberFrom(request);

    return { wilayaNumber, category, page, pageLimit: this.POSTS_LIMIT };
  }

  private async validateAndGetWilayaNumberFrom(request: GetDonationsPostsUseCaseRequest) {
    if (!request.wilayaNumber) return;

    const wilayaNumber = new WilayaNumber(request.wilayaNumber);

    const isWilayaExist = await this.wilayasService.isExist(wilayaNumber);
    if (!isWilayaExist) throw new InvalidWilayaNumberException();

    return wilayaNumber;
  }

  private getPageFrom(request: GetDonationsPostsUseCaseRequest): number {
    return request.page ? request.page : 1;
  }
}

export { GetDonationsPostsUseCase };

