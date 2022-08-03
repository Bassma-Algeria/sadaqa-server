import { UseCase } from '../../UseCase';
import { GetDonationRequestPostsListUseCaseRequest } from './GetDonationRequestPostsListUseCaseRequest';
import { GetDonationRequestPostsListUseCaseResponse } from './GetDonationRequestPostsListUseCaseResponse';

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
        const filters = await this.getBasicFiltersFrom(request);

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
}

export { GetDonationRequestPostsListUseCase };
