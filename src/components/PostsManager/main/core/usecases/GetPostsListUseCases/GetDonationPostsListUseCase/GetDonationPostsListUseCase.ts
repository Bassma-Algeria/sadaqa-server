import { UseCase } from '../../UseCase';
import { GetDonationPostsListUseCaseRequest } from './GetDonationPostsListUseCaseRequest';
import { GetDonationPostsListUseCaseResponse } from './GetDonationPostsListUseCaseResponse';

import { DonationCategory } from '../../../domain/DonationCategory';

import { DonationPostRepository } from '../../../domain/services/PostRepository/DonationPostRepository';

import { DonationPostDtoMapper } from '../../_common_/dtos/DonationPostDtoMapper';

import { GetPostsListUseCase } from '../base/GetPostsListUseCase';

class GetDonationPostsListUseCase
    extends GetPostsListUseCase
    implements UseCase<GetDonationPostsListUseCaseRequest, GetDonationPostsListUseCaseResponse>
{
    constructor(private readonly donationPostRepository: DonationPostRepository) {
        super();
    }

    async handle(
        request?: GetDonationPostsListUseCaseRequest,
    ): Promise<GetDonationPostsListUseCaseResponse> {
        const filters = await this.getFiltersFrom(request);

        const donationsPosts = await this.donationPostRepository.findMany(filters);
        const total = await this.donationPostRepository.count(filters);

        return {
            total,
            page: filters.page,
            end: this.isEndPage(filters.page, total),
            list: donationsPosts.map(post => DonationPostDtoMapper.getInstance().toDto(post)),
        };
    }

    private async getFiltersFrom(request?: GetDonationPostsListUseCaseRequest) {
        const category = request?.category ? new DonationCategory(request.category) : undefined;
        const basicFilters = this.getBasicFiltersFrom(request);

        return { ...basicFilters, category };
    }
}

export { GetDonationPostsListUseCase };
