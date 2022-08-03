import { UseCase } from '../../UseCase';
import { UpdateDonationRequestPostUseCaseRequest } from './UpdateDonationRequestPostUseCaseRequest';
import { UpdateDonationRequestPostUseCaseResponse } from './UpdateDonationRequestPostUseCaseResponse';
import { DonationCategory } from '../../../domain/DonationCategory';
import { DonationRequestPostBuilder } from '../../../domain/DonationRequestPostBuilder';

import { WilayasService } from '../../../domain/services/WilayasService';
import { PicturesManager } from '../../../domain/services/PicturesManager';
import { DonationRequestPostRepository } from '../../../domain/services/PostRepository/DonationRequestPostRepository';
import { DonationRequestPostEventPublisher } from '../../../domain/services/PostEventPublisher/DonationRequestPostEventPublisher';

import { DonationRequestPostDtoMapper } from '../../_common_/dtos/DonationRequestPostDtoMapper';

import { UpdatePostUseCase } from '../base/UpdatePostUseCase';
import { DonationRequestPost } from '../../../domain/DonationRequestPost';

class UpdateDonationRequestPostUseCase
    extends UpdatePostUseCase
    implements
        UseCase<UpdateDonationRequestPostUseCaseRequest, UpdateDonationRequestPostUseCaseResponse>
{
    constructor(
        wilayasService: WilayasService,
        picturesManager: PicturesManager,
        donationRequestPostRepository: DonationRequestPostRepository,
        donationRequestPostEventPublisher: DonationRequestPostEventPublisher,
    ) {
        super(
            wilayasService,
            picturesManager,
            donationRequestPostRepository,
            donationRequestPostEventPublisher,
        );
    }

    async handle(
        request: UpdateDonationRequestPostUseCaseRequest,
    ): Promise<UpdateDonationRequestPostUseCaseResponse> {
        const postBuilder = await this.processAndValidatePostInfoAndGetHydratedPostBuilderFrom(
            request,
        );

        const category = new DonationCategory(request.category);

        const updatedPost = (postBuilder as DonationRequestPostBuilder)
            .withCategory(category)
            .build();

        await this.updatePost(updatedPost);

        this.publishPostUpdatedEvent(updatedPost);

        return DonationRequestPostDtoMapper.getInstance().toDto(updatedPost);
    }

    protected getPostBuilderFrom(post: DonationRequestPost) {
        return DonationRequestPost.aBuilderFrom(post);
    }
}

export { UpdateDonationRequestPostUseCase };
