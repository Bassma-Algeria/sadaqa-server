import { UseCase } from '../../UseCase';
import { GetDonationRequestPostsListUseCaseRequest } from './GetDonationRequestPostsListUseCaseRequest';
import { GetDonationRequestPostsListUseCaseResponse } from './GetDonationRequestPostsListUseCaseResponse';

import { DonationCategory } from '../../../domain/DonationCategory';

import { DonationRequestPostDtoMapper } from '../../_common_/dtos/DonationRequestPostDtoMapper';

import { DonationRequestPostRepository } from '../../../domain/services/PostRepository/DonationRequestPostRepository';

import { GetPostsListUseCase } from '../base/GetPostsListUseCase';

class GetDonationRequestPostsListUseCase
    extends GetPostsListUseCase
    implements
        UseCase<
            GetDonationRequestPostsListUseCaseRequest,
            GetDonationRequestPostsListUseCaseResponse
        >
{
    constructor(private readonly donationRequestPostRepository: DonationRequestPostRepository) {
        super();
    }

    async handle(
        request?: GetDonationRequestPostsListUseCaseRequest,
    ): Promise<GetDonationRequestPostsListUseCaseResponse> {
        const filters = await this.getFiltersFrom(request);

        const donationRequestPosts = await this.donationRequestPostRepository.findMany(filters);
        const total = await this.donationRequestPostRepository.count(filters);

        return {
            total,
            page: filters.page,
            end: this.isEndPage(filters.page, total),
            list: donationRequestPosts.map(post =>
                DonationRequestPostDtoMapper.getInstance().toDto(post),
            ),
        };
    }

    private async getFiltersFrom(request?: GetDonationRequestPostsListUseCaseRequest) {
        const category = request?.category ? new DonationCategory(request.category) : undefined;
        const basicFilters = this.getBasicFiltersFrom(request);

        return { ...basicFilters, category };
    }
}

export { GetDonationRequestPostsListUseCase };
