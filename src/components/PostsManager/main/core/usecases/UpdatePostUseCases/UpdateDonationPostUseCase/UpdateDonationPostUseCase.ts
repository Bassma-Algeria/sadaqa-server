import { UseCase } from '../../UseCase';
import { UpdateDonationPostUseCaseRequest } from './UpdateDonationPostUseCaseRequest';
import { UpdateDonationPostUseCaseResponse } from './UpdateDonationPostUseCaseResponse';

import { DonationPost } from '../../../domain/DonationPost';
import { DonationCategory } from '../../../domain/DonationCategory';
import { DonationPostBuilder } from '../../../domain/DonationPostBuilder';

import { WilayasService } from '../../../domain/services/WilayasService';
import { PicturesManager } from '../../../domain/services/PicturesManager';
import { DonationPostRepository } from '../../../domain/services/PostRepository/DonationPostRepository';
import { DonationPostEventPublisher } from '../../../domain/services/PostEventPublisher/DonationPostEventPublisher';

import { DonationPostDtoMapper } from '../../_common_/dtos/DonationPostDtoMapper';

import { UpdatePostUseCase } from '../base/UpdatePostUseCase';

class UpdateDonationPostUseCase
    extends UpdatePostUseCase
    implements UseCase<UpdateDonationPostUseCaseRequest, UpdateDonationPostUseCaseResponse>
{
    constructor(
        wilayasService: WilayasService,
        picturesManager: PicturesManager,
        postRepository: DonationPostRepository,
        eventPublisher: DonationPostEventPublisher,
    ) {
        super(wilayasService, picturesManager, postRepository, eventPublisher);
    }

    async handle(
        request: UpdateDonationPostUseCaseRequest,
    ): Promise<UpdateDonationPostUseCaseResponse> {
        const postBuilder = await this.processAndValidatePostInfoAndGetHydratedPostBuilderFrom(
            request,
        );

        const category = new DonationCategory(request.category);

        const updatedPost = (postBuilder as DonationPostBuilder).withCategory(category).build();

        await this.updatePost(updatedPost);

        this.publishPostUpdatedEvent(updatedPost);

        return DonationPostDtoMapper.getInstance().toDto(updatedPost);
    }

    protected getPostBuilderFrom(post: DonationPost) {
        return DonationPost.aBuilderFrom(post);
    }
}

export { UpdateDonationPostUseCase };
